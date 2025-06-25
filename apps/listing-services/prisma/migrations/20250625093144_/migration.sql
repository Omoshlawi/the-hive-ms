/*
  Warnings:

  - You are about to drop the column `maintenanceTerms` on the `RentToOwnListing` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseTerms` on the `RentToOwnListing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RentToOwnListing" DROP COLUMN "maintenanceTerms",
DROP COLUMN "purchaseTerms";

-- AlterTable
ALTER TABLE "SaleListingFinancingOption" ADD COLUMN     "notes" TEXT;
