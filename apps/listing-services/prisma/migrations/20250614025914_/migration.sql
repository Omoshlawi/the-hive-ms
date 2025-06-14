/*
  Warnings:

  - The values [UNDER_CONTRACTED] on the enum `ListingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ListingStatus_new" AS ENUM ('DRAFT', 'PENDING', 'BLOCKED', 'APPROVED', 'REJECTED', 'UNDER_CONTRACT', 'SOLD', 'LEASED', 'RENTED', 'WITHDRAWN', 'EXPIRED');
ALTER TABLE "Listing" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ListingStatusHistory" ALTER COLUMN "previousStatus" TYPE "ListingStatus_new" USING ("previousStatus"::text::"ListingStatus_new");
ALTER TABLE "ListingStatusHistory" ALTER COLUMN "newStatus" TYPE "ListingStatus_new" USING ("newStatus"::text::"ListingStatus_new");
ALTER TABLE "Listing" ALTER COLUMN "status" TYPE "ListingStatus_new" USING ("status"::text::"ListingStatus_new");
ALTER TYPE "ListingStatus" RENAME TO "ListingStatus_old";
ALTER TYPE "ListingStatus_new" RENAME TO "ListingStatus";
DROP TYPE "ListingStatus_old";
ALTER TABLE "Listing" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
