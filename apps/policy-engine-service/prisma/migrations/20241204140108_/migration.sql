-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('Create', 'Read', 'Update', 'Delete');

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" JSONB NOT NULL,
    "organizationId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dataPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Privilege" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" JSONB NOT NULL,
    "organizationId" UUID,
    "resourceId" UUID NOT NULL,
    "permitedResourceDataPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "operations" "Operation"[] DEFAULT ARRAY[]::"Operation"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Privilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMemberShip" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "memberPersonId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "memberPerson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationMemberShip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePrivilege" (
    "id" UUID NOT NULL,
    "privilegeId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RolePrivilege_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_organizationId_key" ON "Role"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_name_key" ON "Resource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_name_dataPoints_key" ON "Resource"("name", "dataPoints");

-- CreateIndex
CREATE UNIQUE INDEX "Privilege_name_key" ON "Privilege"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Privilege_organizationId_name_key" ON "Privilege"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Privilege_organizationId_resourceId_permitedResourceDataPoi_key" ON "Privilege"("organizationId", "resourceId", "permitedResourceDataPoints");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMemberShip_memberPersonId_organizationId_key" ON "OrganizationMemberShip"("memberPersonId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePrivilege_privilegeId_roleId_key" ON "RolePrivilege"("privilegeId", "roleId");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Privilege" ADD CONSTRAINT "Privilege_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Privilege" ADD CONSTRAINT "Privilege_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMemberShip" ADD CONSTRAINT "OrganizationMemberShip_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMemberShip" ADD CONSTRAINT "OrganizationMemberShip_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePrivilege" ADD CONSTRAINT "RolePrivilege_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePrivilege" ADD CONSTRAINT "RolePrivilege_privilegeId_fkey" FOREIGN KEY ("privilegeId") REFERENCES "Privilege"("id") ON DELETE CASCADE ON UPDATE CASCADE;
