-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "refRole" TEXT NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emotion" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "niveau" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Emotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEmotionnel" (
    "id" TEXT NOT NULL,
    "refUtilisateur" TEXT NOT NULL,
    "refEmotion" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEmotionnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detente" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Detente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavorisDetente" (
    "id" TEXT NOT NULL,
    "refUtilisateur" TEXT NOT NULL,
    "refDetente" TEXT NOT NULL,

    CONSTRAINT "FavorisDetente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciceRespiration" (
    "id" TEXT NOT NULL,
    "refUtilisateur" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "configuration" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciceRespiration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" TEXT NOT NULL,
    "refUtilisateur" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_clerkUserId_key" ON "Utilisateur"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_nom_key" ON "Role"("nom");

-- CreateIndex
CREATE INDEX "JournalEmotionnel_refUtilisateur_idx" ON "JournalEmotionnel"("refUtilisateur");

-- CreateIndex
CREATE INDEX "JournalEmotionnel_refEmotion_idx" ON "JournalEmotionnel"("refEmotion");

-- CreateIndex
CREATE UNIQUE INDEX "FavorisDetente_refUtilisateur_refDetente_key" ON "FavorisDetente"("refUtilisateur", "refDetente");

-- CreateIndex
CREATE INDEX "ExerciceRespiration_refUtilisateur_idx" ON "ExerciceRespiration"("refUtilisateur");

-- CreateIndex
CREATE INDEX "Diagnostic_refUtilisateur_idx" ON "Diagnostic"("refUtilisateur");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_refRole_fkey" FOREIGN KEY ("refRole") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEmotionnel" ADD CONSTRAINT "JournalEmotionnel_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEmotionnel" ADD CONSTRAINT "JournalEmotionnel_refEmotion_fkey" FOREIGN KEY ("refEmotion") REFERENCES "Emotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavorisDetente" ADD CONSTRAINT "FavorisDetente_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavorisDetente" ADD CONSTRAINT "FavorisDetente_refDetente_fkey" FOREIGN KEY ("refDetente") REFERENCES "Detente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciceRespiration" ADD CONSTRAINT "ExerciceRespiration_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
