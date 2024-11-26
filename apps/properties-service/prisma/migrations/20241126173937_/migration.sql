/*
  Warnings:

  - Made the column `icon` on table `AttributeType` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AttributeType" ALTER COLUMN "icon" SET NOT NULL;
