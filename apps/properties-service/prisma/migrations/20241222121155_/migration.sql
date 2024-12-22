/*
  Warnings:

  - Added the required column `createdBy` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "createdBy" UUID NOT NULL;
