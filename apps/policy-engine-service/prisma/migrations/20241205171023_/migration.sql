-- DropForeignKey
ALTER TABLE "OrganizationMemberShip" DROP CONSTRAINT "OrganizationMemberShip_roleId_fkey";

-- AlterTable
ALTER TABLE "OrganizationMemberShip" ALTER COLUMN "roleId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OrganizationMemberShipRoles" (
    "id" UUID NOT NULL,
    "membershipId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationMemberShipRoles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMemberShipRoles_membershipId_roleId_key" ON "OrganizationMemberShipRoles"("membershipId", "roleId");

-- AddForeignKey
ALTER TABLE "OrganizationMemberShipRoles" ADD CONSTRAINT "OrganizationMemberShipRoles_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "OrganizationMemberShip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMemberShipRoles" ADD CONSTRAINT "OrganizationMemberShipRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
