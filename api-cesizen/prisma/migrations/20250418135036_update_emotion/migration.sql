/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Emotion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `icon` to the `Emotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Emotion" ADD COLUMN     "icon" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Emotion_nom_key" ON "Emotion"("nom");
