-- CreateEnum
CREATE TYPE "RessourceType" AS ENUM ('PDF', 'IMAGE', 'HTML');

-- CreateTable
CREATE TABLE "Ressource" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "RessourceType" NOT NULL,
    "url" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Ressource_pkey" PRIMARY KEY ("id")
);
