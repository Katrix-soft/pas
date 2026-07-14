import os
<<<<<<< Updated upstream
import smtplib
import ssl
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel
from dotenv import load_dotenv
=======
import json
import urllib.request
import urllib.error
>>>>>>> Stashed changes
from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Carga manual del archivo .env para evitar dependencias externas en el entorno de desarrollo
def load_env():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    # Quitar comillas si existen
                    val = val.strip().strip("'").strip('"')
                    os.environ[key.strip()] = val

load_env()

app = FastAPI(
    title="jcorg Broker Platform API",
    description="API Enterprise para PAS y Personal Administrativo del Broker jcorg",
    version="1.0.0"
)

# Configuración CORS para soportar Web, Tauri (desktop) y Capacitor (mobile)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ajustar a dominios específicos en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/api/v1/pas/me", tags=["PAS"])
async def get_current_pas_profile(
    x_pas_id: str | None = Header(None, alias="X-PAS-ID")
):
    """Ejemplo de endpoint simulando aislamiento por pas_id (RLS)"""
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

<<<<<<< Updated upstream
load_dotenv()

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
    
    text = f"Hola,\n\nHas solicitado recuperar tu contraseña. Por favor copia y pega el siguiente enlace en tu navegador:\n\nhttp://localhost:4200/reset-password?token=demo12345\n\nSi no fuiste tú, ignora este correo."
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Recuperación de Contraseña</h2>
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña en JC Organizadores. Por favor haz clic en el siguiente enlace:</p>
        <p><a href="http://localhost:4200/reset-password?token=demo12345" style="display:inline-block; padding:10px 20px; background-color:#2563eb; color:#fff; text-decoration:none; border-radius:5px;">Restablecer Contraseña</a></p>
        <p>Si no fuiste tú, puedes ignorar este correo de forma segura.</p>
        <br/>
        <p>Saludos cordiales,<br/>El equipo de JC Organizadores</p>
      </body>
    </html>
    """
    
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
    
    def send_email():
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=30)
        try:
            # server.set_debuglevel(1)
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

=======
@app.post("/api/v1/quotations/vehicle/automotive", tags=["Quotations"])
async def proxy_sancor_quotation(
    request_body: dict,
    authorization: str | None = Header(None),
    x_dynatrace: str | None = Header(None, alias="X-dynaTrace")
):
    """
    Proxy que actúa como intermediario para evitar problemas de CORS.
    Reenvía las solicitudes de cotización a la API externa de Sancor Seguros.
    """
    base_url = os.getenv("SANCOR_API_BASE_URL")
    client_id = os.getenv("SANCOR_GSS_API_CLIENT_ID")

    if not base_url:
        raise HTTPException(
            status_code=500,
            detail="La variable de entorno SANCOR_API_BASE_URL no está configurada."
        )

    target_url = f"{base_url}/vehicle/automotive"

    # Preparar headers
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

        # Realizar la llamada HTTP sincrónica a la API de Sancor
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
                content={
                    "messages": [{
                        "code": "GSS-ERR-PROXY",
                        "text": f"Error de respuesta del servidor Sancor: {e.reason}",
                        "help": error_body
                    }]
                }
            )
    except Exception as e:
        print(f"Proxy Connection Error: {str(e)}")
        return JSONResponse(
            status_code=502,
            content={
                "messages": [{
                    "code": "GSS-ERR-GATEWAY",
                    "text": "No se pudo establecer comunicación con el Gateway de Sancor Seguros.",
                    "help": str(e)
                }]
            }
        )
>>>>>>> Stashed changes
