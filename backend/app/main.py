import os
import smtplib
import ssl
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

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
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": os.getenv("ENV", "development")
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

