/*
  Warnings:

  - You are about to drop the `TemplateApp` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('SALE', 'RENT', 'LEASE', 'AUCTION', 'HOLIDAY_RENTAL', 'COMMERCIAL_LEASE', 'TIME_SHARE', 'SHORT_TERM_STAY', 'RENT_TO_OWN', 'CO_LIVING');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'UNDER_CONTRACT', 'SOLD', 'LEASED', 'RENTED', 'WITHDRAWN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ListingMediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'VIRTUAL_TOUR', 'FLOOR_PLAN', 'TERMS_AND_CONDITIONS', 'AGREEMENT', 'POLICY', 'OTHER');

-- DropTable
DROP TABLE "TemplateApp";

-- CreateTable
CREATE TABLE "ListingMedia" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "type" "ListingMediaType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "metadata" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "type" "ListingType" NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "listedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "contactPersonId" UUID NOT NULL,
    "contactPerson" JSONB,
    "metadata" JSONB,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdBy" UUID NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "downPayment" DECIMAL(12,2),
    "mortgageAvailable" BOOLEAN NOT NULL DEFAULT false,
    "priceNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "ownershipType" TEXT,
    "titleDeedReady" BOOLEAN NOT NULL DEFAULT false,
    "financingOptions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "rentPeriod" TEXT NOT NULL,
    "minimumRentalPeriod" INTEGER NOT NULL,
    "securityDeposit" DECIMAL(12,2) NOT NULL,
    "petsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "utilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "additionalCharges" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaseListing" (
    "id" UUID NOT NULL,
    "leaseTerm" INTEGER NOT NULL,
    "securityDeposit" DECIMAL(12,2) NOT NULL,
    "maintenanceTerms" TEXT,
    "renewalOptions" JSONB,
    "allowedUses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isCommercial" BOOLEAN NOT NULL DEFAULT false,
    "buildOutAllowance" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaseListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionListing" (
    "id" UUID NOT NULL,
    "startingBid" DECIMAL(12,2) NOT NULL,
    "reservePrice" DECIMAL(12,2),
    "bidIncrement" DECIMAL(12,2) NOT NULL,
    "auctionStart" TIMESTAMP(3) NOT NULL,
    "auctionEnd" TIMESTAMP(3) NOT NULL,
    "preRegistration" BOOLEAN NOT NULL DEFAULT false,
    "bidderApproval" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortTermListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "minimumStay" INTEGER NOT NULL,
    "maximumStay" INTEGER,
    "basePrice" DECIMAL(12,2) NOT NULL,
    "weeklyDiscount" DECIMAL(5,2),
    "monthlyDiscount" DECIMAL(5,2),
    "cleaningFee" DECIMAL(12,2),
    "securityDeposit" DECIMAL(12,2) NOT NULL,
    "selfCheckIn" BOOLEAN NOT NULL DEFAULT false,
    "housekeeping" BOOLEAN NOT NULL DEFAULT false,
    "housekeepingInterval" INTEGER,
    "breakfast" BOOLEAN NOT NULL DEFAULT false,
    "quietHours" JSONB,
    "partiesAllowed" BOOLEAN NOT NULL DEFAULT false,
    "smokingAllowed" BOOLEAN NOT NULL DEFAULT false,
    "availabilityCalendar" JSONB,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShortTermListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentToOwnListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "totalPurchasePrice" DECIMAL(12,2) NOT NULL,
    "monthlyRent" DECIMAL(12,2) NOT NULL,
    "rentCredits" DECIMAL(12,2) NOT NULL,
    "optionFee" DECIMAL(12,2) NOT NULL,
    "optionPeriod" INTEGER NOT NULL,
    "requiredDownPayment" DECIMAL(12,2) NOT NULL,
    "maintenanceTerms" TEXT,
    "purchaseTerms" TEXT,
    "minimumIncome" DECIMAL(12,2),
    "creditScoreRequired" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentToOwnListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoLivingListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "roomType" TEXT NOT NULL,
    "totalOccupancy" INTEGER NOT NULL,
    "currentOccupancy" INTEGER NOT NULL,
    "privateSpace" DECIMAL(8,2) NOT NULL,
    "sharedSpace" DECIMAL(8,2) NOT NULL,
    "communityAmenities" JSONB,
    "communityEvents" BOOLEAN NOT NULL DEFAULT false,
    "coworkingSpace" BOOLEAN NOT NULL DEFAULT false,
    "minimumStay" INTEGER NOT NULL,
    "genderPreference" TEXT,
    "ageRange" JSONB,
    "occupation" TEXT,
    "houseCleaning" JSONB,
    "guestPolicy" TEXT,
    "quietHours" JSONB,
    "communityGuidelines" TEXT,
    "securityDeposit" DECIMAL(12,2) NOT NULL,
    "utilitiesIncluded" JSONB,
    "additionalFees" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoLivingListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingMedia_listingId_type_idx" ON "ListingMedia"("listingId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "SaleListing_listingId_key" ON "SaleListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "RentalListing_listingId_key" ON "RentalListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ShortTermListing_listingId_key" ON "ShortTermListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "RentToOwnListing_listingId_key" ON "RentToOwnListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "CoLivingListing_listingId_key" ON "CoLivingListing"("listingId");

-- AddForeignKey
ALTER TABLE "ListingMedia" ADD CONSTRAINT "ListingMedia_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListing" ADD CONSTRAINT "SaleListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalListing" ADD CONSTRAINT "RentalListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaseListing" ADD CONSTRAINT "LeaseListing_id_fkey" FOREIGN KEY ("id") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionListing" ADD CONSTRAINT "AuctionListing_id_fkey" FOREIGN KEY ("id") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortTermListing" ADD CONSTRAINT "ShortTermListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentToOwnListing" ADD CONSTRAINT "RentToOwnListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoLivingListing" ADD CONSTRAINT "CoLivingListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
