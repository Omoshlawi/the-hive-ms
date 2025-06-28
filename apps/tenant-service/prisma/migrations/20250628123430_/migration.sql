/*
  Warnings:

  - You are about to drop the column `tenantId` on the `BackgroundCheckStatusHistory` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundCheckDate` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundCheckStatus` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `identityVerified` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `incomeVerified` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `applicationId` to the `BackgroundCheckStatusHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BackgroundCheckStatusHistory" DROP CONSTRAINT "BackgroundCheckStatusHistory_tenantId_fkey";

-- DropIndex
DROP INDEX "BackgroundCheckStatusHistory_tenantId_idx";

-- AlterTable
ALTER TABLE "BackgroundCheckStatusHistory" DROP COLUMN "tenantId",
ADD COLUMN     "applicationId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "RentalApplication" ADD COLUMN     "backgroundCheckDate" TIMESTAMP(3),
ADD COLUMN     "backgroundCheckStatus" "BackgroundCheckStatus",
ADD COLUMN     "identityVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "incomeVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "backgroundCheckDate",
DROP COLUMN "backgroundCheckStatus",
DROP COLUMN "identityVerified",
DROP COLUMN "incomeVerified";

-- CreateIndex
CREATE INDEX "BackgroundCheckStatusHistory_applicationId_idx" ON "BackgroundCheckStatusHistory"("applicationId");

-- AddForeignKey
ALTER TABLE "BackgroundCheckStatusHistory" ADD CONSTRAINT "BackgroundCheckStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
