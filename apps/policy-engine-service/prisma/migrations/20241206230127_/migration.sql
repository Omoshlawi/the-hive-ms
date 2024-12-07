/*
  Warnings:

  - You are about to drop the column `memberPerson` on the `OrganizationMemberShip` table. All the data in the column will be lost.
  - You are about to drop the column `memberPersonId` on the `OrganizationMemberShip` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberUserId,organizationId]` on the table `OrganizationMemberShip` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberUserId` to the `OrganizationMemberShip` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OrganizationMemberShip_memberPersonId_organizationId_key";

-- AlterTable
ALTER TABLE "OrganizationMemberShip" DROP COLUMN "memberPerson",
DROP COLUMN "memberPersonId",
ADD COLUMN     "memberUser" JSONB,
ADD COLUMN     "memberUserId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMemberShip_memberUserId_organizationId_key" ON "OrganizationMemberShip"("memberUserId", "organizationId");
