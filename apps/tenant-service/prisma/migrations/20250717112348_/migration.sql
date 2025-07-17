/*
  Warnings:

  - The `checkInTime` column on the `ShortTermAgreementDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `checkOutTime` column on the `ShortTermAgreementDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[applicationId]` on the table `RentalAgreement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationId` to the `RentalAgreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RentalAgreement" ADD COLUMN     "applicationId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ShortTermAgreementDetails" DROP COLUMN "checkInTime",
ADD COLUMN     "checkInTime" TIMESTAMP(3),
DROP COLUMN "checkOutTime",
ADD COLUMN     "checkOutTime" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "RentalAgreement_applicationId_key" ON "RentalAgreement"("applicationId");

-- AddForeignKey
ALTER TABLE "RentalAgreement" ADD CONSTRAINT "RentalAgreement_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
