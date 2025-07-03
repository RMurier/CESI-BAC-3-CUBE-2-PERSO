# CESIZen – Plateforme de santé mentale

CESIZen est une application web et mobile dédiée à la gestion du stress et à la sensibilisation à la santé mentale. Elle permet d’accéder à des informations fiables, d’utiliser des outils de diagnostic, de pratiquer des exercices de respiration et de suivre ses émotions. Le projet repose sur trois parties : une API avec Next.js et Prisma, un frontend admin React, et une application mobile React Native avec Expo.

## 🏗️ Architecture du projet

- **API** : Next.js (App Router) + Prisma
- **Mobile** : React Native (Expo)
- **Admin** : React
- **Authentification** : Clerk + surcouche BDD
- **BDD** : PostgreSQL (via Docker)

## ⚙️ Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/RMurier/CESI-BAC-3-CUBE-2-PERSO.git
cd CESI-BAC-3-CUBE-2-PERSO
```

### 2. Configuration des fichiers `.env`

#### 📁 `api-cesizen/.env`

```env
DATABASE_URL=postgresql://cesizen:cesizenpass@postgres:5432/cesizen
SECRET_KEY=sk_test_xxx
```

#### 📁 `admin/.env`

```env
VITE_API_BASE_ADDRESS=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

#### 📁 `cesizen-mobile/.env`

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:3000 (ip locale de la machine)
EXPO_PUBLIC_CLERK_PUBLISH_KEY=pk_test_xxx
```
---

## 🐳 Lancement avec Docker

### 1. Lancer tous les services

```bash
docker compose -f docker-compose.dev.yml up --build
```

Ce fichier lance :

- la base de données PostgreSQL (avec seed Prisma)
- l’API Next.js sur `http://localhost:3000`
- le frontend admin React sur `http://localhost:5173`

### 2. Lancer l’application mobile

```bash
cd cesizen-mobile
npx expo start
```

Scanner le QR code avec l'app **Expo Go**.

---

## 🧪 Tests

### Tests API

```bash
cd api-cesizen
npm test
```

---

## 🧑‍🎓 Projet personnel – CDA CESI 2025

Ce projet a été réalisé dans le cadre du bloc 2 « Développer et tester les applications informatiques » pour le titre **Concepteur Développeur d’Applications** (CDA).