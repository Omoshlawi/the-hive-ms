/*
  Warnings:

  - The `organizationId` column on the `HiveFile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `uploadedBy` to the `HiveFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HiveFile" ADD COLUMN     "uploadedBy" UUID NOT NULL,
DROP COLUMN "organizationId",
ADD COLUMN     "organizationId" UUID;
