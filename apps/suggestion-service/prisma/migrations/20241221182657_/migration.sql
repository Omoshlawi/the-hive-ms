-- CreateTable
CREATE TABLE "IconFamily" (
    "id" UUID NOT NULL,
    "family" TEXT NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IconFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Icon" (
    "id" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Icon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "County" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capital" TEXT,
    "metadata" JSONB,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "County_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "SubCounty" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countyCode" TEXT NOT NULL,
    "metadata" JSONB,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCounty_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Ward" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countyCode" TEXT NOT NULL,
    "subCountyCode" TEXT NOT NULL,
    "metadata" JSONB,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Kenya',
    "county" TEXT NOT NULL,
    "subCounty" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "village" TEXT,
    "landmark" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "ownerUserId" TEXT,
    "ownerUser" JSONB,
    "organizationId" TEXT,
    "organization" JSONB,
    "metadata" JSONB,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IconFamily_family_key" ON "IconFamily"("family");

-- CreateIndex
CREATE UNIQUE INDEX "Icon_familyId_name_key" ON "Icon"("familyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "County_code_key" ON "County"("code");

-- CreateIndex
CREATE INDEX "County_code_name_idx" ON "County"("code", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCounty_code_key" ON "SubCounty"("code");

-- CreateIndex
CREATE INDEX "SubCounty_countyCode_name_idx" ON "SubCounty"("countyCode", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_code_key" ON "Ward"("code");

-- CreateIndex
CREATE INDEX "Ward_subCountyCode_name_idx" ON "Ward"("subCountyCode", "name");

-- CreateIndex
CREATE INDEX "Address_country_idx" ON "Address"("country");

-- AddForeignKey
ALTER TABLE "Icon" ADD CONSTRAINT "Icon_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "IconFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCounty" ADD CONSTRAINT "SubCounty_countyCode_fkey" FOREIGN KEY ("countyCode") REFERENCES "County"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_countyCode_fkey" FOREIGN KEY ("countyCode") REFERENCES "County"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_subCountyCode_fkey" FOREIGN KEY ("subCountyCode") REFERENCES "SubCounty"("code") ON DELETE CASCADE ON UPDATE CASCADE;
