#!/bin/bash

echo "[2024-12-18 15:45:25] Starting deployment process..."
echo "[2024-12-18 15:45:25] Pulling latest code from main branch..."
git pull origin main

echo "[2024-12-18 15:45:28] Checking ports..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
  echo "[2024-12-18 15:45:28] Port 5000 is in use"
  exit 1
else
  echo "[2024-12-18 15:45:28] Port 5000 is available"
fi

echo "[2024-12-18 15:45:28] Checking PostgreSQL service..."
if pg_isready -q; then
  echo "[2024-12-18 15:45:28] postgresql is running"
else
  echo "[2024-12-18 15:45:28] postgresql is not running"
  exit 1
fi

echo "[2024-12-18 15:45:28] Checking Nginx service..."
if systemctl is-active --quiet nginx; then
  echo "[2024-12-18 15:45:28] nginx is running"
else
  echo "[2024-12-18 15:45:28] nginx is not running"
  exit 1
fi

echo "[2024-12-18 15:45:28] Installing dependencies..."
npm install --prefix server
npm install

echo "[2024-12-18 15:45:31] Running database migrations..."
npx prisma migrate deploy --schema=server/prisma/schema.prisma

echo "[2024-12-18 15:45:33] Building frontend..."
VITE_API_URL=http://localhost:5000/api npm run build
cp -r dist/* /var/www/auroville.social/public/
cp service-worker.js /var/www/auroville.social/public/

echo "[2024-12-18 15:46:07] Starting backend service..."
NODE_ENV=production npm start --prefix server
