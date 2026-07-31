# Stage 1: Build Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Configurar límite de memoria Node para evitar fallos de memoria en VPS pequeño durante el build
ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:prod

# Stage 2: Unified Production Server (Nginx + FastAPI)
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONOPTIMIZE=1

WORKDIR /app

# Instalar Nginx y utilidades del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/ .

# Configurar Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

# Copiar estáticos compilados de Angular desde Stage 1
COPY --from=build /app/dist/apps/web/browser /usr/share/nginx/html

# Copiar script de arranque unificado
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
