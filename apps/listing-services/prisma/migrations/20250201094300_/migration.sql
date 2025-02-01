/*
  Warnings:

  - You are about to drop the column `bidderApproval` on the `AuctionListing` table. All the data in the column will be lost.
  - You are about to drop the column `preRegistration` on the `AuctionListing` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ListingMedia` table. All the data in the column will be lost.
  - You are about to drop the column `additionalCharges` on the `RentalListing` table. All the data in the column will be lost.
  - You are about to drop the column `ownershipType` on the `SaleListing` table. All the data in the column will be lost.
  - The `financingOptions` column on the `SaleListing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `cleaningFee` on the `ShortTermListing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listingId]` on the table `AuctionListing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listingId]` on the table `LeaseListing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listingId` to the `AuctionListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listingId` to the `LeaseListing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuctionListing" DROP CONSTRAINT "AuctionListing_id_fkey";

-- DropForeignKey
ALTER TABLE "LeaseListing" DROP CONSTRAINT "LeaseListing_id_fkey";

-- DropIndex
DROP INDEX "ListingMedia_listingId_type_idx";

-- AlterTable
ALTER TABLE "AuctionListing" DROP COLUMN "bidderApproval",
DROP COLUMN "preRegistration",
ADD COLUMN     "listingId" UUID NOT NULL,
ADD COLUMN     "requireBidderApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirePreRegistration" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "LeaseListing" ADD COLUMN     "listingId" UUID NOT NULL,
ADD COLUMN     "renewalAllowed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "type",
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ListingMedia" DROP COLUMN "type",
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "RentalListing" DROP COLUMN "additionalCharges";

-- AlterTable
ALTER TABLE "SaleListing" DROP COLUMN "ownershipType",
DROP COLUMN "financingOptions",
ADD COLUMN     "financingOptions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ShortTermListing" DROP COLUMN "cleaningFee";

-- DropEnum
DROP TYPE "ListingMediaType";

-- DropEnum
DROP TYPE "ListingType";

-- CreateIndex
CREATE UNIQUE INDEX "AuctionListing_listingId_key" ON "AuctionListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaseListing_listingId_key" ON "LeaseListing"("listingId");

-- CreateIndex
CREATE INDEX "ListingMedia_listingId_idx" ON "ListingMedia"("listingId");

-- AddForeignKey
ALTER TABLE "LeaseListing" ADD CONSTRAINT "LeaseListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionListing" ADD CONSTRAINT "AuctionListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
