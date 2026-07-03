# jcorg Broker Platform (PAS & Backoffice Monorepo)

Esta es la plataforma enterprise para los Productores de Asesores de Seguros (PAS) y el backoffice administrativo de **jcorg**. Está estructurada como un Monorepo Nx para maximizar el código compartido entre aplicaciones Web, Móviles (Capacitor) y Escritorio (Tauri), acoplado a un backend asíncrono en FastAPI.

---

## Estructura del Proyecto

*   **`apps/`**: Aplicaciones contenedoras (shells).
    *   `web/`: Portal web para PAS y Dashboard de jcorg con Angular 20+ (SSR & Hydration).
    *   `mobile/`: App móvil nativa para PAS (Capacitor).
    *   `desktop/`: App de escritorio nativa para administración (Tauri).
    *   `admin/`: Panel de control administrativo y auditoría (SPA).
*   **`libs/`**: Módulos lógicos y UI compartidos y desacoplados.
    *   `core/`: Singletons base, base de datos offline, sincronización.
    *   `ui/`: Sistema de diseño basado en CSS Vanilla y Angular Signals.
    *   `api/`: Cliente SDK para llamadas HTTP y mapeo DTO.
    *   `auth/`: Integración con Keycloak y rotación de tokens.
    *   `theme/`: Variables de diseño y paletas HSL (look Stripe/Linear).
    *   `crm/`, `policies/`, `quotations/`, `claims/`, `dashboard/`: Módulos de negocio.
*   **`backend/`**: Aplicación de FastAPI (Python 3.13) estructurada bajo Arquitectura Hexagonal.

---

## Requisitos de Entorno

*   **Node.js**: >= 20.x
*   **Python**: >= 3.13
*   **Docker & Docker Compose** (para desarrollo local y bases de datos)

---

## Guía de Desarrollo Local

### 1. Clonar e Instalar Dependencias del Frontend
```bash
npm install
```

### 2. Levantar la Base de Datos y Redis locales
```bash
cd backend
docker-compose up -d
```

### 3. Iniciar el Backend (FastAPI)
```bash
# Crear entorno virtual e instalar dependencias
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Iniciar servidor uvicorn
npm run backend:dev
```

### 4. Iniciar la Aplicación Web (Angular)
```bash
npm run start
```

---

## Despliegue en Easypanel

El archivo `backend/docker-compose.yml` sirve como blueprint para configurar tus recursos en Easypanel.
1. Crea un nuevo proyecto en tu panel de Easypanel.
2. Agrega un servicio **PostgreSQL** y un servicio **Redis** usando las plantillas de base de datos nativas de Easypanel.
3. Configura el servicio de FastAPI importando tu repositorio Git y conectando las variables de entorno (`DATABASE_URL`, `REDIS_URL`).
4. Para la aplicación web de Angular, utiliza el Dockerfile de SSR y expón el puerto 4000.
# pas
