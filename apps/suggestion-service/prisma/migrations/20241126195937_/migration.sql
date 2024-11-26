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

-- CreateIndex
CREATE UNIQUE INDEX "IconFamily_family_key" ON "IconFamily"("family");

-- CreateIndex
CREATE UNIQUE INDEX "Icon_familyId_name_key" ON "Icon"("familyId", "name");

-- AddForeignKey
ALTER TABLE "Icon" ADD CONSTRAINT "Icon_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "IconFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;
