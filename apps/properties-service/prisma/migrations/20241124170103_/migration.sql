/*
  Warnings:

  - Added the required column `icon` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Amenity" ADD COLUMN     "icon" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "AttributeType" ADD COLUMN     "icon" JSONB;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "icon" JSONB NOT NULL;
