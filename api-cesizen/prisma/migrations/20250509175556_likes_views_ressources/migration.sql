-- AlterTable
ALTER TABLE "Ressource" ADD COLUMN     "vues" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "RessourceLike" (
    "id" TEXT NOT NULL,
    "refRessource" TEXT NOT NULL,
    "refUtilisateur" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RessourceLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RessourceLike_refRessource_refUtilisateur_key" ON "RessourceLike"("refRessource", "refUtilisateur");

-- AddForeignKey
ALTER TABLE "RessourceLike" ADD CONSTRAINT "RessourceLike_refRessource_fkey" FOREIGN KEY ("refRessource") REFERENCES "Ressource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RessourceLike" ADD CONSTRAINT "RessourceLike_refUtilisateur_fkey" FOREIGN KEY ("refUtilisateur") REFERENCES "Utilisateur"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
