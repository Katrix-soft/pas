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

# ============================================================
# Carga de variables de entorno
# Una sola carga, con path explícito al .env del proyecto
# ============================================================
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


app = FastAPI(
    title="jcorg Broker Platform API",
    description="API Enterprise para PAS y Personal Administrativo del Broker jcorg",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ajustar a dominios específicos en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Cliente Mercantil Andina — importado desde services/
# ============================================================
from app.services.mercantil_andina import MercantilAndinaClient, MercantilAndinaError

_mercantil_client: Optional[MercantilAndinaClient] = None


def get_mercantil_client() -> MercantilAndinaClient:
    """Singleton lazy: se instancia la primera vez que se usa, no al importar."""
    global _mercantil_client
    if _mercantil_client is None:
        _mercantil_client = MercantilAndinaClient()
    return _mercantil_client


# ============================================================
# Endpoints - System
# ============================================================

@app.get("/health", tags=["System"])
async def health_check():
    """Endpoint para monitoreo y healthcheck de Easypanel"""
    client_id = os.getenv("SANCOR_GSS_API_CLIENT_ID", "")
    masked_client_id = f"{client_id[:4]}...{client_id[-4:]}" if len(client_id) > 8 else "None"
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": os.getenv("ENV", "development"),
        "sancor_client_id_loaded": masked_client_id
    }


# ============================================================
# Endpoints - Debug (⚠️ SACAR EN PRODUCCIÓN)
# ============================================================

@app.get("/debug/mercantil-env", tags=["Debug"])
async def debug_mercantil_env():
    """Verifica que las variables de entorno de Mercantil Andina estén cargadas."""
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


@app.get("/debug/mercantil-login", tags=["Debug"])
async def debug_mercantil_login():
    """
    Dispara un login real contra Mercantil Andina y devuelve el resultado.
    Útil para confirmar credenciales y ver el JSON de respuesta (campo de token, expires_in, etc).
    ⚠️ SACAR EN PRODUCCIÓN.
    """
    try:
        client = get_mercantil_client()
        # Forzamos login ignorando cache
        client._token = None
        token = await client._get_token()
        return {
            "status": "✅ Login OK",
            "token_preview": f"{token[:10]}...{token[-6:]}" if token else "None",
            "expires_at": client._token_expires_at,
        }
    except MercantilAndinaError as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"status": "❌ Login FAILED", "detail": e.detail}
        )
    except RuntimeError as e:
        return JSONResponse(
            status_code=500,
            content={"status": "❌ Config error", "detail": str(e)}
        )


# ============================================================
# Endpoints - PAS
# ============================================================

@app.get("/api/v1/pas/me", tags=["PAS"])
async def get_current_pas_profile(
    x_pas_id: str | None = Header(None, alias="X-PAS-ID")
):
    if not x_pas_id:
        raise HTTPException(status_code=401, detail="Header X-PAS-ID es obligatorio")

    return {
        "pas_id": x_pas_id,
        "name": "Productor Asesor de Seguros - Demo",
        "broker": "jcorg",
        "portfolio_summary": {
            "active_clients": 142,
            "active_policies": 312,
            "monthly_commission_ars": 4500000.00
        }
    }


# ============================================================
# Endpoints - Auth
# ============================================================

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
# Endpoints - Quotations: Sancor
# ============================================================

@app.post("/api/v1/quotations/vehicle/automotive", tags=["Quotations - Sancor"])
async def proxy_sancor_quotation(
    request_body: dict,
    authorization: str | None = Header(None),
    x_dynatrace: str | None = Header(None, alias="X-dynaTrace")
):
    """
    Proxy para evitar CORS. Reenvía la solicitud de cotización a la API de Sancor Seguros.
    """
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

    print(f"Proxy POST: {target_url}")
    print(f"Authorization: {authorization[:30] if authorization else 'None'}...")

    try:
        data = json.dumps(request_body).encode("utf-8")
        req = urllib.request.Request(target_url, data=data, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=30) as response:
            resp_body = response.read().decode("utf-8")
            return json.loads(resp_body)

    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="ignore")
        status_code = e.code
        print(f"Sancor API Error {status_code}: {error_body}")
        try:
            parsed_error = json.loads(error_body)
            return JSONResponse(status_code=status_code, content=parsed_error)
        except Exception:
            return JSONResponse(
                status_code=status_code,
                content={"messages": [{"code": "GSS-ERR-PROXY", "text": f"Error Sancor: {e.reason}", "help": error_body}]}
            )
    except Exception as e:
        print(f"Proxy Connection Error: {str(e)}")
        return JSONResponse(
            status_code=502,
            content={"messages": [{"code": "GSS-ERR-GATEWAY", "text": "No se pudo comunicar con Sancor.", "help": str(e)}]}
        )


# ============================================================
# Endpoints - Quotations: Mercantil Andina
# ============================================================

@app.get("/api/v1/quotations/mercantil/vehiculos", tags=["Quotations - Mercantil"])
async def mercantil_buscar_vehiculos(
    q: str,
    anio: int,
    tipo: str = "AUTO",
    offset: int = 1,
    limit: int = 20,
):
    """
    Busca vehículos por texto libre + año.
    Ej: /api/v1/quotations/mercantil/vehiculos?q=honda+civic&anio=2020&tipo=AUTO
    """
    try:
        client = get_mercantil_client()
        return await client.buscar_vehiculos(query=q, anio=anio, tipo=tipo, offset=offset, limit=limit)
    except MercantilAndinaError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@app.get("/api/v1/quotations/mercantil/marcas", tags=["Quotations - Mercantil"])
async def mercantil_obtener_marcas():
    try:
        client = get_mercantil_client()
        marcas = await client.obtener_marcas()

        return {
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

    except MercantilAndinaError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@app.get("/api/v1/quotations/mercantil/modelos", tags=["Quotations - Mercantil"])
async def mercantil_obtener_modelos(marca: str):
    """
    Devuelve los modelos disponibles para una marca.
    Ej:
    /api/v1/quotations/mercantil/modelos?marca=HONDA
    """
    try:
        client = get_mercantil_client()
        return await client.obtener_modelos_por_marca(marca)
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