-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "organization" JSONB,
ADD COLUMN     "organizationId" UUID;
