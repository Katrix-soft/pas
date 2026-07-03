import os
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
