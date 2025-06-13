-- AlterTable
ALTER TABLE "FinancingOption" ADD COLUMN     "voided" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ListingCharge" ADD COLUMN     "voided" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OwnershipType" ADD COLUMN     "voided" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SaleListingFinancingOption" ADD COLUMN     "voided" BOOLEAN NOT NULL DEFAULT false;
