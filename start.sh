#!/bin/sh
set -e

echo "🚀 Iniciando Backend FastAPI (Uvicorn) en 127.0.0.1:8000..."
cd /app && uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 1 --limit-concurrency 100 &

echo "🌐 Iniciando Frontend Nginx en 0.0.0.0:80..."
exec nginx -g "daemon off;"
