/*
  Warnings:

  - A unique constraint covering the columns `[propertyAId,propertyBId,typeId]` on the table `Relationship` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aIsToB]` on the table `RelationshipType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bIsToA]` on the table `RelationshipType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aIsToB,bIsToA]` on the table `RelationshipType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Relationship_propertyAId_propertyBId_typeId_key" ON "Relationship"("propertyAId", "propertyBId", "typeId");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipType_aIsToB_key" ON "RelationshipType"("aIsToB");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipType_bIsToA_key" ON "RelationshipType"("bIsToA");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipType_aIsToB_bIsToA_key" ON "RelationshipType"("aIsToB", "bIsToA");
