-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING', 'BLOCKED', 'APPROVED', 'REJECTED', 'UNDER_CONTRACT', 'SOLD', 'LEASED', 'RENTED', 'WITHDRAWN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'FLOOR_PLAN', 'LEGAL_DOC', 'CONTRACT', 'OTHER');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('RENTAL', 'SALE', 'LEASE', 'AUCTION', 'RENT_TO_OWN', 'SHORT_TERM', 'CO_LIVING');

-- CreateEnum
CREATE TYPE "ChargeFrequency" AS ENUM ('ONE_TIME', 'MONTHLY', 'WEEKLY', 'PER_NIGHT', 'ANNUALLY');

-- CreateTable
CREATE TABLE "ListingStatusHistory" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "previousStatus" "ListingStatus" NOT NULL,
    "newStatus" "ListingStatus" NOT NULL,
    "changedBy" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingMedia" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "title" TEXT,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "metadata" JSONB,
    "mediaType" "MediaType" NOT NULL,
    "documentPurpose" TEXT,
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
    "listingNumber" TEXT NOT NULL,
    "propertyId" UUID NOT NULL,
    "property" JSONB,
    "organizationId" UUID NOT NULL,
    "organization" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ListingType" NOT NULL,
    "coverImage" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "listedDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "contactPersonId" UUID NOT NULL,
    "metadata" JSONB,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdBy" UUID NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnershipType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnershipType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancingOption" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancingOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "downPayment" DECIMAL(12,2),
    "priceNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "ownershipTypeId" UUID NOT NULL,
    "titleDeedReady" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleListingFinancingOption" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "optionId" UUID NOT NULL,
    "notes" TEXT,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleListingFinancingOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "rentPeriod" TEXT NOT NULL,
    "minimumStay" INTEGER NOT NULL,
    "securityDeposit" DECIMAL(12,2) NOT NULL,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "utilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaseListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "leaseTermInMoths" INTEGER NOT NULL,
    "securityDeposit" DECIMAL(12,2) NOT NULL,
    "renewalAllowed" BOOLEAN NOT NULL DEFAULT false,
    "allowedUses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaseListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "startingBid" DECIMAL(12,2) NOT NULL,
    "reservePrice" DECIMAL(12,2),
    "bidIncrement" DECIMAL(12,2) NOT NULL,
    "auctionStart" TIMESTAMP(3) NOT NULL,
    "auctionEnd" TIMESTAMP(3) NOT NULL,
    "requirePreRegistration" BOOLEAN NOT NULL DEFAULT false,
    "requireBidderApproval" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionListing_pkey" PRIMARY KEY ("id")
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
    "minimumIncome" DECIMAL(12,2),
    "creditScoreRequired" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentToOwnListing_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "ListingCharge" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "frequency" "ChargeFrequency" NOT NULL DEFAULT 'ONE_TIME',
    "mandatory" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingCharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingMedia_listingId_idx" ON "ListingMedia"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_listingNumber_key" ON "Listing"("listingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SaleListing_listingId_key" ON "SaleListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleListingFinancingOption_listingId_optionId_key" ON "SaleListingFinancingOption"("listingId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "RentalListing_listingId_key" ON "RentalListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaseListing_listingId_key" ON "LeaseListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionListing_listingId_key" ON "AuctionListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "RentToOwnListing_listingId_key" ON "RentToOwnListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ShortTermListing_listingId_key" ON "ShortTermListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "CoLivingListing_listingId_key" ON "CoLivingListing"("listingId");

-- CreateIndex
CREATE INDEX "ListingCharge_listingId_idx" ON "ListingCharge"("listingId");

-- AddForeignKey
ALTER TABLE "ListingStatusHistory" ADD CONSTRAINT "ListingStatusHistory_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingMedia" ADD CONSTRAINT "ListingMedia_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListing" ADD CONSTRAINT "SaleListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListing" ADD CONSTRAINT "SaleListing_ownershipTypeId_fkey" FOREIGN KEY ("ownershipTypeId") REFERENCES "OwnershipType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListingFinancingOption" ADD CONSTRAINT "SaleListingFinancingOption_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "SaleListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListingFinancingOption" ADD CONSTRAINT "SaleListingFinancingOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "FinancingOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalListing" ADD CONSTRAINT "RentalListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaseListing" ADD CONSTRAINT "LeaseListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionListing" ADD CONSTRAINT "AuctionListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentToOwnListing" ADD CONSTRAINT "RentToOwnListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortTermListing" ADD CONSTRAINT "ShortTermListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoLivingListing" ADD CONSTRAINT "CoLivingListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingCharge" ADD CONSTRAINT "ListingCharge_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
