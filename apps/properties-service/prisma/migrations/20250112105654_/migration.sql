-- DropForeignKey
ALTER TABLE "PropertyAmenity" DROP CONSTRAINT "PropertyAmenity_amenityId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyAmenity" DROP CONSTRAINT "PropertyAmenity_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyAttribute" DROP CONSTRAINT "PropertyAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyAttribute" DROP CONSTRAINT "PropertyAttribute_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyCategory" DROP CONSTRAINT "PropertyCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyCategory" DROP CONSTRAINT "PropertyCategory_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyMedia" DROP CONSTRAINT "PropertyMedia_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAttribute" ADD CONSTRAINT "PropertyAttribute_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAttribute" ADD CONSTRAINT "PropertyAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "AttributeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyCategory" ADD CONSTRAINT "PropertyCategory_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyCategory" ADD CONSTRAINT "PropertyCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
