/*
  Warnings:

  - You are about to drop the column `configuration` on the `ExerciceRespiration` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `ExerciceRespiration` table. All the data in the column will be lost.
  - You are about to drop the column `refUtilisateur` on the `ExerciceRespiration` table. All the data in the column will be lost.
  - You are about to drop the column `refDetente` on the `FavorisDetente` table. All the data in the column will be lost.
  - You are about to drop the `Detente` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[refUtilisateur,refExerciceRespiration]` on the table `FavorisDetente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bienfait` to the `ExerciceRespiration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icone` to the `ExerciceRespiration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ExerciceRespiration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refExerciceRespiration` to the `FavorisDetente` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('INSPIRER', 'EXPIRER', 'RETENIR');

-- DropForeignKey
ALTER TABLE "ExerciceRespiration" DROP CONSTRAINT "ExerciceRespiration_refUtilisateur_fkey";

-- DropForeignKey
ALTER TABLE "FavorisDetente" DROP CONSTRAINT "FavorisDetente_refDetente_fkey";

-- DropIndex
DROP INDEX "ExerciceRespiration_refUtilisateur_idx";

-- DropIndex
DROP INDEX "FavorisDetente_refUtilisateur_refDetente_key";

-- AlterTable
ALTER TABLE "ExerciceRespiration" DROP COLUMN "configuration",
DROP COLUMN "date",
DROP COLUMN "refUtilisateur",
ADD COLUMN     "bienfait" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "icone" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FavorisDetente" DROP COLUMN "refDetente",
ADD COLUMN     "refExerciceRespiration" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JournalEmotionnel" ALTER COLUMN "date" DROP DEFAULT;

-- DropTable
DROP TABLE "Detente";

-- CreateTable
CREATE TABLE "ActionRespiration" (
    "id" TEXT NOT NULL,
    "exerciceId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "type" "ActionType" NOT NULL,
    "dureeSecondes" INTEGER NOT NULL,

    CONSTRAINT "ActionRespiration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavorisDetente_refUtilisateur_refExerciceRespiration_key" ON "FavorisDetente"("refUtilisateur", "refExerciceRespiration");

-- AddForeignKey
ALTER TABLE "FavorisDetente" ADD CONSTRAINT "FavorisDetente_refExerciceRespiration_fkey" FOREIGN KEY ("refExerciceRespiration") REFERENCES "ExerciceRespiration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionRespiration" ADD CONSTRAINT "ActionRespiration_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "ExerciceRespiration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
