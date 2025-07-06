/*
  Warnings:

  - The values [PROSPECTIVE] on the enum `TenantStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TenantStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'BLACKLISTED');
ALTER TABLE "Tenant" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tenant" ALTER COLUMN "status" TYPE "TenantStatus_new" USING ("status"::text::"TenantStatus_new");
ALTER TABLE "TenantStatusHistory" ALTER COLUMN "previousStatus" TYPE "TenantStatus_new" USING ("previousStatus"::text::"TenantStatus_new");
ALTER TABLE "TenantStatusHistory" ALTER COLUMN "newStatus" TYPE "TenantStatus_new" USING ("newStatus"::text::"TenantStatus_new");
ALTER TYPE "TenantStatus" RENAME TO "TenantStatus_old";
ALTER TYPE "TenantStatus_new" RENAME TO "TenantStatus";
DROP TYPE "TenantStatus_old";
ALTER TABLE "Tenant" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
