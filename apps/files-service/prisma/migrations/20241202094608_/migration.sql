/*
  Warnings:

  - You are about to drop the `TemplateApp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TemplateApp";

-- CreateTable
CREATE TABLE "HiveFile" (
    "id" UUID NOT NULL,
    "path" TEXT NOT NULL,
    "organization" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HiveFile_pkey" PRIMARY KEY ("id")
);
