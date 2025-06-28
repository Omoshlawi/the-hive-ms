/*
  Warnings:

  - You are about to drop the `TemplateApp` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TenantType" AS ENUM ('INDIVIDUAL', 'COUPLE', 'FAMILY', 'ROOMMATES', 'CORPORATE');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECTIVE', 'FORMER', 'BLACKLISTED');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('EMPLOYED_FULL_TIME', 'EMPLOYED_PART_TIME', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED', 'STUDENT', 'CONTRACTOR');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'SMS', 'MAIL');

-- CreateEnum
CREATE TYPE "BackgroundCheckStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'NOT_REQUIRED');

-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('PERSONAL', 'PROFESSIONAL', 'PREVIOUS_LANDLORD', 'EMPLOYER', 'CHARACTER');

-- CreateEnum
CREATE TYPE "ReferenceRecommendation" AS ENUM ('HIGHLY_RECOMMENDED', 'RECOMMENDED', 'NEUTRAL', 'NOT_RECOMMENDED', 'STRONGLY_NOT_RECOMMENDED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TenantLeaseStatus" AS ENUM ('ACTIVE', 'TERMINATED', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID_DOCUMENT', 'INCOME_VERIFICATION', 'EMPLOYMENT_LETTER', 'BANK_STATEMENT', 'REFERENCE_LETTER', 'BACKGROUND_CHECK', 'CREDIT_REPORT', 'INSURANCE_CERTIFICATE', 'PET_DOCUMENTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('GENERAL', 'PERSONAL_INFO', 'EMPLOYMENT', 'INCOME', 'RENTAL_HISTORY', 'REFERENCES', 'PETS', 'VEHICLES', 'BACKGROUND', 'PREFERENCES', 'EMERGENCY_CONTACT', 'FAMILY', 'FINANCIAL', 'LEGAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'BOOLEAN', 'DATE', 'EMAIL', 'PHONE', 'SINGLE_SELECT', 'MULTI_SELECT', 'CHECKBOX', 'DROPDOWN', 'FILE_UPLOAD', 'CURRENCY', 'PERCENTAGE', 'URL', 'TIME', 'DATETIME', 'RATING', 'SLIDER', 'SIGNATURE');

-- DropTable
DROP TABLE "TemplateApp";

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "person" JSONB,
    "tenantNumber" TEXT,
    "tenantType" "TenantType" NOT NULL DEFAULT 'INDIVIDUAL',
    "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
    "creditScore" INTEGER,
    "monthlyIncome" DECIMAL(12,2),
    "employmentStatus" "EmploymentStatus",
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "emergencyContactEmail" TEXT,
    "emergencyContactRelation" TEXT,
    "preferredContactMethod" "ContactMethod" NOT NULL DEFAULT 'EMAIL',
    "languagePreference" TEXT DEFAULT 'en',
    "specialRequirements" TEXT,
    "backgroundCheckStatus" "BackgroundCheckStatus",
    "backgroundCheckDate" TIMESTAMP(3),
    "identityVerified" BOOLEAN NOT NULL DEFAULT false,
    "incomeVerified" BOOLEAN NOT NULL DEFAULT false,
    "internalNotes" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantStatusHistory" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "previousStatus" "TenantStatus" NOT NULL,
    "newStatus" "TenantStatus" NOT NULL,
    "changedBy" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantReference" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "referenceType" "ReferenceType" NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "company" TEXT,
    "position" TEXT,
    "contacted" BOOLEAN NOT NULL DEFAULT false,
    "contactedDate" TIMESTAMP(3),
    "response" TEXT,
    "recommendation" "ReferenceRecommendation",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplication" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "applicationNumber" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "desiredMoveInDate" TIMESTAMP(3) NOT NULL,
    "leaseTerm" INTEGER,
    "proposedRent" DECIMAL(10,2),
    "securityDeposit" DECIMAL(10,2),
    "petDetails" TEXT,
    "vehicleInfo" TEXT,
    "screeningScore" DECIMAL(5,2),
    "manualReviewNeeded" BOOLEAN NOT NULL DEFAULT false,
    "assignedToUser" UUID,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationStatusHistory" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "previousStatus" "ApplicationStatus" NOT NULL,
    "newStatus" "ApplicationStatus" NOT NULL,
    "changedBy" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RentalApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoApplicant" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "ssn" TEXT,
    "employmentStatus" "EmploymentStatus",
    "employer" TEXT,
    "jobTitle" TEXT,
    "monthlyIncome" DECIMAL(10,2),
    "relationshipType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoApplicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantLease" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "leaseId" UUID NOT NULL,
    "isPrimaryTenant" BOOLEAN NOT NULL DEFAULT true,
    "moveInDate" TIMESTAMP(3),
    "moveOutDate" TIMESTAMP(3),
    "status" "TenantLeaseStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantLease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantLeaseStatusHistory" (
    "id" UUID NOT NULL,
    "tenantLeaseId" UUID NOT NULL,
    "previousStatus" "TenantStatus" NOT NULL,
    "newStatus" "TenantStatus" NOT NULL,
    "changedBy" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantLeaseStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantDocument" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "metadata" JSONB,
    "title" TEXT,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploadedBy" UUID,

    CONSTRAINT "TenantDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackgroundCheckStatusHistory" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "previousStatus" "BackgroundCheckStatus" NOT NULL,
    "newStatus" "BackgroundCheckStatus" NOT NULL,
    "changedBy" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BackgroundCheckStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreeningQuestion" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "options" TEXT[],
    "placeholder" TEXT,
    "helpText" TEXT,
    "minLength" INTEGER,
    "maxLength" INTEGER,
    "minValue" DECIMAL(12,2),
    "maxValue" DECIMAL(12,2),
    "pattern" TEXT,
    "category" "QuestionCategory" NOT NULL DEFAULT 'GENERAL',
    "tags" TEXT[],
    "hasScoring" BOOLEAN NOT NULL DEFAULT false,
    "scoringRules" JSONB,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "ScreeningQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreeningResponse" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "textResponse" TEXT,
    "numericResponse" DECIMAL(12,2),
    "booleanResponse" BOOLEAN,
    "dateResponse" TIMESTAMP(3),
    "jsonResponse" JSONB,
    "calculatedScore" DECIMAL(5,2),
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "flagReason" TEXT,
    "requiresVerification" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreeningResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreeningQuestionTemplate" (
    "id" UUID NOT NULL,
    "organizationId" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "QuestionCategory" NOT NULL,
    "isSystemTemplate" BOOLEAN NOT NULL DEFAULT false,
    "questions" JSONB NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DECIMAL(3,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,

    CONSTRAINT "ScreeningQuestionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingScreeningConfig" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "isScreeningEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoScreenEnabled" BOOLEAN NOT NULL DEFAULT false,
    "manualReviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "passingScore" DECIMAL(5,2),
    "weightByCategory" JSONB,
    "questionIds" UUID[],
    "customInstructions" TEXT,
    "additionalRequirements" TEXT,
    "notifyOnApplication" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnAutoReject" BOOLEAN NOT NULL DEFAULT true,
    "notificationEmails" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "ListingScreeningConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_tenantNumber_key" ON "Tenant"("tenantNumber");

-- CreateIndex
CREATE INDEX "Tenant_personId_idx" ON "Tenant"("personId");

-- CreateIndex
CREATE INDEX "Tenant_tenantNumber_idx" ON "Tenant"("tenantNumber");

-- CreateIndex
CREATE INDEX "Tenant_status_idx" ON "Tenant"("status");

-- CreateIndex
CREATE INDEX "Tenant_createdAt_idx" ON "Tenant"("createdAt");

-- CreateIndex
CREATE INDEX "TenantReference_tenantId_idx" ON "TenantReference"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "RentalApplication_applicationNumber_key" ON "RentalApplication"("applicationNumber");

-- CreateIndex
CREATE INDEX "RentalApplication_organizationId_idx" ON "RentalApplication"("organizationId");

-- CreateIndex
CREATE INDEX "RentalApplication_tenantId_idx" ON "RentalApplication"("tenantId");

-- CreateIndex
CREATE INDEX "RentalApplication_propertyId_idx" ON "RentalApplication"("propertyId");

-- CreateIndex
CREATE INDEX "RentalApplication_listingId_idx" ON "RentalApplication"("listingId");

-- CreateIndex
CREATE INDEX "RentalApplication_status_idx" ON "RentalApplication"("status");

-- CreateIndex
CREATE INDEX "RentalApplicationStatusHistory_applicationId_idx" ON "RentalApplicationStatusHistory"("applicationId");

-- CreateIndex
CREATE INDEX "CoApplicant_applicationId_idx" ON "CoApplicant"("applicationId");

-- CreateIndex
CREATE INDEX "TenantLease_organizationId_idx" ON "TenantLease"("organizationId");

-- CreateIndex
CREATE INDEX "TenantLease_tenantId_idx" ON "TenantLease"("tenantId");

-- CreateIndex
CREATE INDEX "TenantLease_leaseId_idx" ON "TenantLease"("leaseId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantLease_tenantId_leaseId_key" ON "TenantLease"("tenantId", "leaseId");

-- CreateIndex
CREATE INDEX "TenantLeaseStatusHistory_tenantLeaseId_idx" ON "TenantLeaseStatusHistory"("tenantLeaseId");

-- CreateIndex
CREATE INDEX "TenantDocument_organizationId_idx" ON "TenantDocument"("organizationId");

-- CreateIndex
CREATE INDEX "TenantDocument_tenantId_idx" ON "TenantDocument"("tenantId");

-- CreateIndex
CREATE INDEX "TenantDocument_documentType_idx" ON "TenantDocument"("documentType");

-- CreateIndex
CREATE INDEX "BackgroundCheckStatusHistory_tenantId_idx" ON "BackgroundCheckStatusHistory"("tenantId");

-- CreateIndex
CREATE INDEX "ScreeningQuestion_organizationId_idx" ON "ScreeningQuestion"("organizationId");

-- CreateIndex
CREATE INDEX "ScreeningQuestion_category_idx" ON "ScreeningQuestion"("category");

-- CreateIndex
CREATE INDEX "ScreeningQuestion_isActive_idx" ON "ScreeningQuestion"("isActive");

-- CreateIndex
CREATE INDEX "ScreeningQuestion_sortOrder_idx" ON "ScreeningQuestion"("sortOrder");

-- CreateIndex
CREATE INDEX "ScreeningResponse_organizationId_idx" ON "ScreeningResponse"("organizationId");

-- CreateIndex
CREATE INDEX "ScreeningResponse_applicationId_idx" ON "ScreeningResponse"("applicationId");

-- CreateIndex
CREATE INDEX "ScreeningResponse_questionId_idx" ON "ScreeningResponse"("questionId");

-- CreateIndex
CREATE INDEX "ScreeningResponse_flagged_idx" ON "ScreeningResponse"("flagged");

-- CreateIndex
CREATE UNIQUE INDEX "ScreeningResponse_applicationId_questionId_key" ON "ScreeningResponse"("applicationId", "questionId");

-- CreateIndex
CREATE INDEX "ScreeningQuestionTemplate_organizationId_idx" ON "ScreeningQuestionTemplate"("organizationId");

-- CreateIndex
CREATE INDEX "ScreeningQuestionTemplate_category_idx" ON "ScreeningQuestionTemplate"("category");

-- CreateIndex
CREATE INDEX "ScreeningQuestionTemplate_isSystemTemplate_idx" ON "ScreeningQuestionTemplate"("isSystemTemplate");

-- CreateIndex
CREATE INDEX "ListingScreeningConfig_organizationId_idx" ON "ListingScreeningConfig"("organizationId");

-- CreateIndex
CREATE INDEX "ListingScreeningConfig_listingId_idx" ON "ListingScreeningConfig"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingScreeningConfig_listingId_key" ON "ListingScreeningConfig"("listingId");

-- AddForeignKey
ALTER TABLE "TenantStatusHistory" ADD CONSTRAINT "TenantStatusHistory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantReference" ADD CONSTRAINT "TenantReference_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplication" ADD CONSTRAINT "RentalApplication_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplicationStatusHistory" ADD CONSTRAINT "RentalApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoApplicant" ADD CONSTRAINT "CoApplicant_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantLease" ADD CONSTRAINT "TenantLease_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantLeaseStatusHistory" ADD CONSTRAINT "TenantLeaseStatusHistory_tenantLeaseId_fkey" FOREIGN KEY ("tenantLeaseId") REFERENCES "TenantLease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantDocument" ADD CONSTRAINT "TenantDocument_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundCheckStatusHistory" ADD CONSTRAINT "BackgroundCheckStatusHistory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningResponse" ADD CONSTRAINT "ScreeningResponse_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningResponse" ADD CONSTRAINT "ScreeningResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ScreeningQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
