#!/bin/sh

echo "🔄 Migration de la base..."
npx prisma migrate deploy

echo "🌱 Seed de la base..."
npx ts-node prisma/seed.ts

echo "🚀 Démarrage de l'API Next.js..."
npm run start
