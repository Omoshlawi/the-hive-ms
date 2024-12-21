/*
  Warnings:

  - You are about to drop the `PropertyLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PropertyLocation" DROP CONSTRAINT "PropertyLocation_propertyId_fkey";

-- DropTable
DROP TABLE "PropertyLocation";
