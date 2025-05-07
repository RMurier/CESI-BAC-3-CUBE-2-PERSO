/*
  Warnings:

  - The primary key for the `Utilisateur` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Diagnostic" DROP CONSTRAINT "Diagnostic_refUtilisateur_fkey";

-- DropForeignKey
ALTER TABLE "ExerciceRespiration" DROP CONSTRAINT "ExerciceRespiration_refUtilisateur_fkey";

-- DropForeignKey
ALTER TABLE "FavorisDetente" DROP CONSTRAINT "FavorisDetente_refUtilisateur_fkey";

-- DropForeignKey
ALTER TABLE "JournalEmotionnel" DROP CONSTRAINT "JournalEmotionnel_refUtilisateur_fkey";

-- AlterTable
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("clerkUserId");

-- AddForeignKey
ALTER TABLE "JournalEmotionnel" ADD CONSTRAINT "JournalEmotionnel_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavorisDetente" ADD CONSTRAINT "FavorisDetente_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciceRespiration" ADD CONSTRAINT "ExerciceRespiration_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
