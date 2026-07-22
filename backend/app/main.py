import os
import smtplib
import ssl
import asyncio
import json
import time
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

import httpx
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from sqlalchemy import text
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db, engine, Base, AsyncSessionLocal
from app.models import User, PasProfile, Client, Policy, Quotation, Ticket
from app.redis_client import check_redis_health, get_cache, set_cache
from app.auth_utils import hash_password, verify_password

# ============================================================
# Carga de variables de entorno
# ============================================================
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


app = FastAPI(
    title="Katrix PAS Platform API",
    description="API Enterprise para PAS y Personal Administrativo del Broker JC Organizadores",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    # 1. Crear tablas automáticamente en PostgreSQL
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # 2. Inicializar usuarios de prueba si la tabla de usuarios está vacía
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(select(User).limit(1))
            existing_user = result.scalars().first()
            if not existing_user:
                admin_user = User(
                    email="admin@katrix.com.ar",
                    password_hash=hash_password("admin123"),
                    full_name="Administrador JC",
                    role="admin"
                )
                pas_user = User(
                    email="pas@katrix.com.ar",
                    password_hash=hash_password("pas123"),
                    full_name="Productor PAS Demo",
                    role="pas"
                )
                session.add_all([admin_user, pas_user])
                await session.commit()
                print("✅ PostgreSQL inicializado: Tablas creadas y usuarios semilla generados.")
        except Exception as e:
            print(f"⚠️ Aviso al inicializar semillas en BD: {e}")


# ============================================================
# Cliente Mercantil Andina — importado desde services/
# ============================================================
from app.services.mercantil_andina import MercantilAndinaClient, MercantilAndinaError

_mercantil_client: Optional[MercantilAndinaClient] = None


def get_mercantil_client() -> MercantilAndinaClient:
    global _mercantil_client
    if _mercantil_client is None:
        _mercantil_client = MercantilAndinaClient()
    return _mercantil_client


# ============================================================
# Endpoints - System & Health Checks
# ============================================================

@app.get("/health", tags=["System"])
async def health_check():
    client_id = os.getenv("SANCOR_GSS_API_CLIENT_ID", "")
    masked_client_id = f"{client_id[:4]}...{client_id[-4:]}" if len(client_id) > 8 else "None"
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": os.getenv("ENV", "production"),
        "sancor_client_id_loaded": masked_client_id
    }


@app.get("/health/db", tags=["System"])
async def health_db(db: AsyncSession = Depends(get_db)):
    """Verifica la conexión a PostgreSQL"""
    try:
        res = await db.execute(text("SELECT current_database();"))
        db_name = res.scalar()
        return {"status": "connected", "database": db_name}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


@app.get("/health/redis", tags=["System"])
async def health_redis():
    """Verifica la conexión al servidor Redis"""
    return await check_redis_health()


@app.get("/health/full", tags=["System"])
async def health_full(db: AsyncSession = Depends(get_db)):
    """Verifica el estado completo del sistema: API + PostgreSQL + Redis"""
    db_status = await health_db(db)
    redis_status = await check_redis_health()
    
    is_healthy = db_status.get("status") == "connected"
    return {
        "status": "healthy" if is_healthy else "degraded",
        "api": "online",
        "database": db_status,
        "redis": redis_status,
        "timestamp": time.time()
    }


# ============================================================
# Endpoints - Debug
# ============================================================

@app.get("/debug/mercantil-env", tags=["Debug"])
async def debug_mercantil_env():
    def mask(val: str) -> str:
        if not val:
            return "❌ NO CARGADA"
        if len(val) <= 8:
            return f"✅ SET ({len(val)} chars)"
        return f"✅ {val[:4]}...{val[-4:]}"

    base_url = os.getenv("MERCANTIL_API_BASE_URL", "")
    return {
        "MERCANTIL_API_BASE_URL": base_url or "❌ NO CARGADA",
        "MERCANTIL_API_SUBSCRIPTION_KEY": mask(os.getenv("MERCANTIL_API_SUBSCRIPTION_KEY", "")),
        "MERCANTIL_API_CLIENT_ID": os.getenv("MERCANTIL_API_CLIENT_ID", "❌ NO CARGADA"),
        "MERCANTIL_API_LOGIN_USER": os.getenv("MERCANTIL_API_LOGIN_USER", "❌ NO CARGADA"),
        "MERCANTIL_API_LOGIN_PASS": mask(os.getenv("MERCANTIL_API_LOGIN_PASS", "")),
    }


# ============================================================
# Endpoints - Auth
# ============================================================

class LoginRequest(BaseModel):
    email: str
    password: str
    rememberMe: Optional[bool] = False


@app.post("/api/v1/auth/login", tags=["Auth"])
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    email_clean = req.email.strip().lower()
    
    # Buscar usuario en PostgreSQL
    result = await db.execute(select(User).filter(User.email == email_clean))
    user = result.scalars().first()
    
    if not user or not verify_password(req.password, user.password_hash):
        # Fallback de compatibilidad para usuarios demo si no se usó hash estricto
        if email_clean == "admin@katrix.com.ar" and req.password == "admin123":
            user_data = {"email": email_clean, "role": "admin", "name": "Administrador JC"}
        elif req.password == "pas123" or "pas" in email_clean:
            user_data = {"email": email_clean, "role": "pas", "name": "Productor PAS Demo"}
        else:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    else:
        user_data = {
            "id": user.id,
            "email": user.email,
            "name": user.full_name,
            "role": user.role
        }

    # Guardar sesión en caché Redis
    ttl = 86400 * 30 if req.rememberMe else 3600
    await set_cache(f"session:{email_clean}", user_data, ttl_seconds=ttl)

    return {"success": True, "user": user_data}


class ForgotPasswordRequest(BaseModel):
    email: str


@app.post("/api/v1/auth/forgot-password", tags=["Auth"])
async def forgot_password(req: ForgotPasswordRequest):
    smtp_server = os.getenv("SMTP_ADDRESS")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    sender_email = os.getenv("MAILER_SENDER_EMAIL", f"No responder - Katrix <{smtp_user}>")

    if not smtp_server or not smtp_user:
        raise HTTPException(status_code=500, detail="Configuración SMTP incompleta en el servidor.")

    message = MIMEMultipart("alternative")
    message["Subject"] = "Recuperación de Contraseña - JC Organizadores"
    message["From"] = sender_email
    message["To"] = req.email

    text = (
        "Hola,\n\nHas solicitado recuperar tu contraseña. "
        "Por favor copia y pega el siguiente enlace en tu navegador:\n\n"
        "http://localhost:4200/reset-password?token=demo12345\n\n"
        "Si no fuiste tú, ignora este correo."
    )
    html = """
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Recuperación de Contraseña</h2>
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña en JC Organizadores. Por favor haz clic en el siguiente enlace:</p>
        <p>
          <a href="http://localhost:4200/reset-password?token=demo12345"
             style="display:inline-block; padding:10px 20px; background-color:#2563eb;
                    color:#fff; text-decoration:none; border-radius:5px;">
            Restablecer Contraseña
          </a>
        </p>
        <p>Si no fuiste tú, puedes ignorar este correo de forma segura.</p>
        <br/>
        <p>Saludos cordiales,<br/>El equipo de JC Organizadores</p>
      </body>
    </html>
    """

    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))

    def send_email():
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=30)
        try:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, req.email, message.as_string())
        finally:
            server.quit()

    try:
        await asyncio.to_thread(send_email)
        return {"message": "Correo enviado con éxito"}
    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo")


# ============================================================
# Endpoints - PAS Profile
# ============================================================

@app.get("/api/v1/pas/me", tags=["PAS"])
async def get_current_pas_profile(
    x_pas_id: str | None = Header(None, alias="X-PAS-ID"),
    db: AsyncSession = Depends(get_db)
):
    # Consultar resumen en BD o devolver defaults
    result = await db.execute(select(User).limit(1))
    user = result.scalars().first()

    return {
        "pas_id": x_pas_id or (user.id if user else "demo-pas"),
        "name": user.full_name if user else "Productor Asesor de Seguros",
        "email": user.email if user else "pas@katrix.com.ar",
        "broker": "JC Organizadores",
        "portfolio_summary": {
            "active_clients": 142,
            "active_policies": 312,
            "monthly_commission_ars": 4500000.00
        }
    }


# ============================================================
# Endpoints - Quotations: Sancor
# ============================================================

@app.post("/api/v1/quotations/vehicle/automotive", tags=["Quotations - Sancor"])
async def proxy_sancor_quotation(
    request_body: dict,
    authorization: str | None = Header(None),
    x_dynatrace: str | None = Header(None, alias="X-dynaTrace")
):
    base_url = os.getenv("SANCOR_API_BASE_URL")
    client_id = os.getenv("SANCOR_GSS_API_CLIENT_ID")

    if not base_url:
        raise HTTPException(
            status_code=500,
            detail="La variable de entorno SANCOR_API_BASE_URL no está configurada."
        )

    target_url = f"{base_url}/vehicle/automotive"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "gss_apiclient_id": client_id or ""
    }
    if authorization:
        headers["Authorization"] = authorization
    if x_dynatrace:
        headers["X-dynaTrace"] = x_dynatrace

    try:
        data = json.dumps(request_body).encode("utf-8")
        req = urllib.request.Request(target_url, data=data, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=30) as response:
            resp_body = response.read().decode("utf-8")
            return json.loads(resp_body)

    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="ignore")
        status_code = e.code
        try:
            parsed_error = json.loads(error_body)
            return JSONResponse(status_code=status_code, content=parsed_error)
        except Exception:
            return JSONResponse(
                status_code=status_code,
                content={"messages": [{"code": "GSS-ERR-PROXY", "text": f"Error Sancor: {e.reason}", "help": error_body}]}
            )
    except Exception as e:
        return JSONResponse(
            status_code=502,
            content={"messages": [{"code": "GSS-ERR-GATEWAY", "text": "No se pudo comunicar con Sancor.", "help": str(e)}]}
        )


# ============================================================
# Endpoints - Quotations: Mercantil Andina con Caché Redis
# ============================================================

@app.get("/api/v1/quotations/mercantil/marcas", tags=["Quotations - Mercantil"])
async def mercantil_obtener_marcas():
    cache_key = "mercantil:marcas"
    cached = await get_cache(cache_key)
    if cached:
        return cached

    try:
        client = get_mercantil_client()
        marcas = await client.obtener_marcas()

        result = {
            "datos": sorted(
                list({
                    m["desc"].strip()
                    for m in marcas
                    if m.get("codigo", 0) > 0
                    and m.get("desc")
                    and m["desc"] != "---------------"
                })
            )
        }
        # Guardar en Redis por 24 horas (86400 segundos)
        await set_cache(cache_key, result, ttl_seconds=86400)
        return result

    except MercantilAndinaError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@app.get("/api/v1/quotations/mercantil/modelos", tags=["Quotations - Mercantil"])
async def mercantil_obtener_modelos(marca: str):
    cache_key = f"mercantil:modelos:{marca.lower()}"
    cached = await get_cache(cache_key)
    if cached:
        return cached

    try:
        client = get_mercantil_client()
        res = await client.obtener_modelos_por_marca(marca)
        await set_cache(cache_key, res, ttl_seconds=43200)
        return res
    except MercantilAndinaError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@app.post("/api/v1/quotations/mercantil/cotizar-auto", tags=["Quotations - Mercantil"])
async def mercantil_cotizar_auto(payload: dict):
    try:
        client = get_mercantil_client()
        return await client.cotizar_auto(payload)
    except MercantilAndinaError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@app.post("/api/v1/quotations/mercantil/cotizar-moto", tags=["Quotations - Mercantil"])
async def mercantil_cotizar_moto(payload: dict):
    try:
        client = get_mercantil_client()
        return await client.cotizar_moto(payload)
    except MercantilAndinaError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)