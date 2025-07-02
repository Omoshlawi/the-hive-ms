/*
  Warnings:

  - You are about to drop the column `amenities` on the `ShortTermAgreementDetails` table. All the data in the column will be lost.
  - You are about to drop the column `cleaningFee` on the `ShortTermAgreementDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShortTermAgreementDetails" DROP COLUMN "amenities",
DROP COLUMN "cleaningFee";
