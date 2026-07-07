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

## Guía de Desarrollo Local y Pruebas (Trainees)

Si eres un Trainee ingresando al proyecto, sigue estos pasos para levantar todo el entorno de forma local y comenzar a probar el CRM.

### 1. Clonar e Instalar Dependencias del Frontend
Asegúrate de estar en la raíz del proyecto y ejecuta:
```bash
npm install
```

### 2. Levantar el Entorno Backend (Docker Compose)
El backend requiere una base de datos y servicios en caché para funcionar. Utilizamos Docker para facilitarlo.
Desde la raíz del proyecto, ingresa a la carpeta del backend y levanta los contenedores:
```bash
cd backend
docker-compose up -d
```
*(Nota: Asegúrate de tener Docker Engine y Docker Compose instalados y corriendo en tu máquina).*

### 3. Iniciar el Backend (FastAPI)
Una vez que Docker está corriendo los servicios, levanta la API de Python:
```bash
# Vuelve a la raíz del proyecto si estabas en /backend
# Crea un entorno virtual e instala las dependencias
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# Inicia el servidor uvicorn (escuchando en http://localhost:8000)
npm run backend:dev
```

### 4. Iniciar la Aplicación Web (Angular)
En una terminal separada (manteniendo el backend corriendo), levanta el entorno de desarrollo de Angular:
```bash
npm run start:web
```
Ingresa a `http://localhost:4200` desde tu navegador.

### 5. Credenciales de Prueba (Login)
Actualmente el sistema utiliza credenciales mockeadas en memoria para facilitar las pruebas sin requerir una base de datos poblada inicialmente.
Utiliza las siguientes credenciales en la pantalla de Login según el rol que desees probar:

**Perfil Administrador (Backoffice - Acceso total):**
*   **Usuario/Email:** `admin@katrix.com`
*   **Contraseña:** `admin`

**Perfil Productor (PAS - Acceso limitado a sus tickets):**
*   **Usuario/Email:** `pas@katrix.com`
*   **Contraseña:** `pas`

---

## Despliegue en Easypanel

El archivo `backend/docker-compose.yml` sirve como blueprint para configurar tus recursos en Easypanel.
1. Crea un nuevo proyecto en tu panel de Easypanel.
2. Agrega un servicio **PostgreSQL** y un servicio **Redis** usando las plantillas de base de datos nativas de Easypanel.
3. Configura el servicio de FastAPI importando tu repositorio Git y conectando las variables de entorno (`DATABASE_URL`, `REDIS_URL`).
4. Para la aplicación web de Angular, utiliza el Dockerfile de SSR y expón el puerto 4000.
# pas
