#!/bin/bash
set -e

NOMBRE=$1
PUERTO=$2

if [ -z "$NOMBRE" ] || [ -z "$PUERTO" ]; then
  echo "Uso: ./crear-microservicio.sh <nombre-servicio> <puerto>"
  echo "Ejemplo: ./crear-microservicio.sh quotation-service 3010"
  exit 1
fi

if [ -d "$NOMBRE" ]; then
  echo "⚠️  La carpeta '$NOMBRE' ya existe. Borrala primero si querés recrearla desde cero:"
  echo "   rm -rf $NOMBRE"
  exit 1
fi

echo "🚀 Creando microservicio NestJS: $NOMBRE en el puerto $PUERTO"

# El "yes |" auto-confirma cualquier prompt interactivo (como el approve-builds de pnpm)
yes | npx --yes @nestjs/cli new "$NOMBRE" --package-manager pnpm --skip-git

cd "$NOMBRE"

# Por si algo quedó pendiente de aprobar tras el scaffold inicial
yes | pnpm approve-builds 2>/dev/null || true
pnpm install

pnpm install ioredis @nestjs/microservices

cat > src/main.ts << EOF
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6380,
    },
  });
  await app.listen();
  console.log('$NOMBRE escuchando vía Redis...');
}
bootstrap();
EOF

cat > src/app.controller.ts << EOF
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('health')
  health() {
    return { status: '$NOMBRE alive' };
  }
}
EOF

cat > .env.example << EOF
PORT=$PUERTO
REDIS_HOST=pas-redis
REDIS_PORT=6380
EOF

cat > Dockerfile << 'DOCKEREOF'
FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
CMD ["pnpm", "run", "start:dev"]
DOCKEREOF

echo "node_modules
dist
.env" > .dockerignore

echo "✅ Listo. cd $NOMBRE && cp .env.example .env && pnpm run start:dev"
