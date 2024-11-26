/*
  Warnings:

  - Added the required column `typeId` to the `Relationship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Relationship" ADD COLUMN     "typeId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "RelationshipType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
