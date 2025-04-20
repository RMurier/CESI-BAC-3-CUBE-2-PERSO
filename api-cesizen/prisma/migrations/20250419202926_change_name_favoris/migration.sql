/*
  Warnings:

  - You are about to drop the `FavorisDetente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavorisDetente" DROP CONSTRAINT "FavorisDetente_refExerciceRespiration_fkey";

-- DropForeignKey
ALTER TABLE "FavorisDetente" DROP CONSTRAINT "FavorisDetente_refUtilisateur_fkey";

-- DropTable
DROP TABLE "FavorisDetente";

-- CreateTable
CREATE TABLE "FavorisRespiration" (
    "id" TEXT NOT NULL,
    "refUtilisateur" TEXT NOT NULL,
    "refExerciceRespiration" TEXT NOT NULL,

    CONSTRAINT "FavorisRespiration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavorisRespiration_refUtilisateur_refExerciceRespiration_key" ON "FavorisRespiration"("refUtilisateur", "refExerciceRespiration");

-- AddForeignKey
ALTER TABLE "FavorisRespiration" ADD CONSTRAINT "FavorisRespiration_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavorisRespiration" ADD CONSTRAINT "FavorisRespiration_refExerciceRespiration_fkey" FOREIGN KEY ("refExerciceRespiration") REFERENCES "ExerciceRespiration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
