/*
  Warnings:

  - Made the column `tenantNumber` on table `Tenant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "tenantNumber" SET NOT NULL;
