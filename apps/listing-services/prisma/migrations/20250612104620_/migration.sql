-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('Draft', 'Pending', 'Blocked', 'Approved', 'Rejected', 'Contracted', 'Sold', 'Leased', 'Rented', 'Withdrawn', 'Expired');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'FLOOR_PLAN', 'LEGAL_DOC', 'CONTRACT', 'OTHER');

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
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "metadata" JSONB,
    "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
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
    "propertyId" UUID NOT NULL,
    "property" JSONB,
    "organizationId" UUID NOT NULL,
    "organization" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ListingStatus" NOT NULL DEFAULT 'Draft',
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
    "financingOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalListing" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "rentPeriod" TEXT NOT NULL,
    "minimumStay" INTEGER NOT NULL,
    "securityDeposit" DECIMAL(12,2) NOT NULL,
    "petsAllowed" BOOLEAN NOT NULL DEFAULT false,
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
    "leaseTerm" INTEGER NOT NULL,
    "securityDeposit" DECIMAL(12,2) NOT NULL,
    "maintenanceTerms" TEXT,
    "renewalOptions" JSONB,
    "renewalAllowed" BOOLEAN NOT NULL DEFAULT false,
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
    "maintenanceTerms" TEXT,
    "purchaseTerms" TEXT,
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

-- CreateIndex
CREATE INDEX "ListingMedia_listingId_idx" ON "ListingMedia"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleListing_listingId_key" ON "SaleListing"("listingId");

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

-- AddForeignKey
ALTER TABLE "ListingStatusHistory" ADD CONSTRAINT "ListingStatusHistory_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingMedia" ADD CONSTRAINT "ListingMedia_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListing" ADD CONSTRAINT "SaleListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
