/*
  Warnings:

  - You are about to drop the column `isPrimaryTenant` on the `AgreementParticipant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdditionalCharge" ADD COLUMN     "dueDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AgreementParticipant" DROP COLUMN "isPrimaryTenant";

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "voided" BOOLEAN NOT NULL DEFAULT false;
