/*
  Warnings:

  - Added the required column `updatedAt` to the `FinancingOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OwnershipType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SaleListingFinancingOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinancingOption" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OwnershipType" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SaleListingFinancingOption" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
