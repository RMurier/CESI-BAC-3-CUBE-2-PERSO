#!/bin/sh

echo "📦 Génération Prisma client..."
npx prisma generate

echo "🌱 Exécution des migrations..."
npx prisma db push

echo "🌱 Lancement du seed..."
npx prisma db seed

echo "🏗️ Build de l'application Next.js..."
npm run build

echo "🚀 Lancement de l'API..."
npx next start -H 0.0.0.0
