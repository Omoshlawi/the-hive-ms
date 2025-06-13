/*
  Warnings:

  - A unique constraint covering the columns `[listingId,optionId]` on the table `SaleListingFinancingOption` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SaleListingFinancingOption_listingId_optionId_key" ON "SaleListingFinancingOption"("listingId", "optionId");
