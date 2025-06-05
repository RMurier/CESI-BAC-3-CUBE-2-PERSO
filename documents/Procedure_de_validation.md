# ✅ Procédure de validation – Projet CESIZen

## 1. Objectif

Cette procédure décrit les étapes nécessaires pour valider le bon fonctionnement de l’application CESIZen dans le cadre du Bloc 2 : « Développer et tester les applications informatiques ».

---

## 2. Environnement requis

- Poste de travail avec Node.js et npm installés
- Accès aux trois projets :
  - API (Next.js + Prisma)
  - Frontend Admin (React)
  - Mobile (Expo React Native)
- Base de données PostgreSQL ou SQLite en local
- Fichiers `.env` correctement renseignés
- Clerk configuré avec clés valides

---

## 3. Étapes de validation

### 3.1. Initialisation

1. Cloner le dépôt et installer les dépendances :
```bash
git clone https://github.com/RMurier/CESI-BAC-3-CUBE-2-PERSO.git
cd cesizen
npm install
```

2. Lancer les migrations et générer Prisma :
```bash
cd api-cesizen
npx prisma generate
npx prisma migrate dev
```

---

### 3.2. Lancement des modules

| Module              | Commande                           | Résultat attendu                        |
|---------------------|-------------------------------------|-----------------------------------------|
| API                 | `npm run dev`                      | Serveur sur `http://localhost:3000`     |
| Admin Frontend      | `npm run dev`                      | UI React accessible                     |
| Application mobile  | `npx expo start --lan`             | QR code scannable sur Expo Go           |

---

### 3.3. Vérifications fonctionnelles

- ✅ Connexion et authentification Clerk
- ✅ Vérification du rôle administrateur
- ✅ Accès aux modules admin (utilisateurs, émotions, respiration)
- ✅ Création / modification / suppression des entités
- ✅ Responsive design fonctionnel sur desktop & mobile

---

## 4. Tests techniques

| Test                     | Méthode                   | Résultat attendu       |
|--------------------------|---------------------------|------------------------|
| Test unitaire API        | `npm test` (dans API)     | Tous les tests passent |
| Test fonctionnel manuel  | Checklist utilisateur     | Comportement validé    |
| Test de non régression   | Relancer après modification | Pas de bug introduit |

---

## 5. Validation finale

La validation est considérée comme **réussie** si :

- Tous les modules se lancent et fonctionnent comme prévu
- Tous les tests sont passés
- Les anomalies bloquantes sont corrigées
- Le PV de recette est rempli et signé

---

**Signature du validateur** : RM
**Date** : 07 / 05 / 2025
