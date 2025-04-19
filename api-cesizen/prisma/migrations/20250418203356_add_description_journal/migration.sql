/*
  Warnings:

  - Added the required column `description` to the `JournalEmotionnel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JournalEmotionnel" ADD COLUMN     "description" TEXT NOT NULL;
