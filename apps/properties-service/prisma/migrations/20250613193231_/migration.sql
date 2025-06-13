/*
  Warnings:

  - The values [Image,Video,Document,Tour_3D] on the enum `PropertyMediaType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Draft,Blocked,Archived,Approved,Rejected,Paused,Pending] on the enum `PropertyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PropertyMediaType_new" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'TOUR_3D');
ALTER TABLE "PropertyMedia" ALTER COLUMN "type" TYPE "PropertyMediaType_new" USING ("type"::text::"PropertyMediaType_new");
ALTER TYPE "PropertyMediaType" RENAME TO "PropertyMediaType_old";
ALTER TYPE "PropertyMediaType_new" RENAME TO "PropertyMediaType";
DROP TYPE "PropertyMediaType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PropertyStatus_new" AS ENUM ('DRAFT', 'BLOCKED', 'ARCHIVED', 'APPROVED', 'REJECTED', 'PAUSED', 'PENDING');
ALTER TABLE "Property" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PropertyStatusHistory" ALTER COLUMN "previousStatus" TYPE "PropertyStatus_new" USING ("previousStatus"::text::"PropertyStatus_new");
ALTER TABLE "PropertyStatusHistory" ALTER COLUMN "newStatus" TYPE "PropertyStatus_new" USING ("newStatus"::text::"PropertyStatus_new");
ALTER TABLE "Property" ALTER COLUMN "status" TYPE "PropertyStatus_new" USING ("status"::text::"PropertyStatus_new");
ALTER TYPE "PropertyStatus" RENAME TO "PropertyStatus_old";
ALTER TYPE "PropertyStatus_new" RENAME TO "PropertyStatus";
DROP TYPE "PropertyStatus_old";
ALTER TABLE "Property" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
