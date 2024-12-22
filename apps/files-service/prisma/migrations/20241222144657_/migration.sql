/*
  Warnings:

  - You are about to drop the column `mbSize` on the `HiveFile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HiveFile" DROP COLUMN "mbSize",
ADD COLUMN     "bytesSize" DECIMAL(65,30),
ADD COLUMN     "organizationId" TEXT,
ALTER COLUMN "organization" DROP NOT NULL;
