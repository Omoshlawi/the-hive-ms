/*
  Warnings:

  - Added the required column `addressId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "address" JSONB,
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "organization" DROP NOT NULL;
