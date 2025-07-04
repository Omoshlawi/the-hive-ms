-- CreateEnum
CREATE TYPE "AgreementType" AS ENUM ('LEASE', 'RENTAL', 'SHORT_TERM', 'CORPORATE', 'SUBLEASE', 'COMMERCIAL', 'RENT_TO_OWN', 'STUDENT', 'SENIOR');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "ChargeFrequency" AS ENUM ('ONE_TIME', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'PER_NIGHT', 'PER_STAY');

-- CreateEnum
CREATE TYPE "ParticipantType" AS ENUM ('PRIMARY_TENANT', 'CO_TENANT', 'GUARANTOR', 'OCCUPANT', 'SUBLESSEE', 'AUTHORIZED_OCCUPANT');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'RENEWED', 'CANCELLED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('ACTIVE', 'TERMINATED', 'EXPIRED', 'PENDING', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TenantType" AS ENUM ('INDIVIDUAL', 'COUPLE', 'FAMILY', 'ROOMMATES', 'CORPORATE', 'STUDENT');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLACKLISTED', 'PROSPECTIVE');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('EMPLOYED_FULL_TIME', 'EMPLOYED_PART_TIME', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED', 'STUDENT', 'CONTRACTOR');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'SMS', 'MAIL', 'IN_PERSON');

-- CreateEnum
CREATE TYPE "BackgroundCheckStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'NOT_REQUIRED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('PERSONAL', 'PROFESSIONAL', 'PREVIOUS_LANDLORD', 'EMPLOYER', 'CHARACTER', 'EMERGENCY_CONTACT');

-- CreateEnum
CREATE TYPE "ReferenceRecommendation" AS ENUM ('HIGHLY_RECOMMENDED', 'RECOMMENDED', 'NEUTRAL', 'NOT_RECOMMENDED', 'STRONGLY_NOT_RECOMMENDED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'EXPIRED', 'CONDITIONAL_APPROVAL');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID_DOCUMENT', 'INCOME_VERIFICATION', 'EMPLOYMENT_LETTER', 'BANK_STATEMENT', 'REFERENCE_LETTER', 'BACKGROUND_CHECK', 'CREDIT_REPORT', 'INSURANCE_CERTIFICATE', 'PET_DOCUMENTATION', 'LEASE_AGREEMENT', 'RENTAL_HISTORY', 'TAX_RETURN', 'PROOF_OF_FUNDS', 'OTHER');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('GENERAL', 'PERSONAL_INFO', 'EMPLOYMENT', 'INCOME', 'RENTAL_HISTORY', 'REFERENCES', 'PETS', 'VEHICLES', 'BACKGROUND', 'PREFERENCES', 'EMERGENCY_CONTACT', 'FAMILY', 'FINANCIAL', 'LEGAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'BOOLEAN', 'DATE', 'EMAIL', 'PHONE', 'SINGLE_SELECT', 'MULTI_SELECT', 'CHECKBOX', 'DROPDOWN', 'FILE_UPLOAD', 'CURRENCY', 'PERCENTAGE', 'URL', 'TIME', 'DATETIME', 'RATING', 'SLIDER', 'SIGNATURE');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "person" JSONB,
    "organizationId" UUID,
    "organization" JSONB,
    "tenantNumber" TEXT NOT NULL,
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
    "internalNotes" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantStatusHistory" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "previousStatus" "TenantStatus" NOT NULL,
    "newStatus" "TenantStatus" NOT NULL,
    "changedBy" UUID,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantReference" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
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
    "personId" UUID NOT NULL,
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
    "backgroundCheckStatus" "BackgroundCheckStatus",
    "backgroundCheckDate" TIMESTAMP(3),
    "identityVerified" BOOLEAN NOT NULL DEFAULT false,
    "incomeVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "person" JSONB,
    "voided" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RentalApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationStatusHistory" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "previousStatus" "ApplicationStatus" NOT NULL,
    "newStatus" "ApplicationStatus" NOT NULL,
    "changedBy" UUID,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RentalApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoApplicant" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "person" JSONB,

    CONSTRAINT "CoApplicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalAgreement" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "agreementNumber" VARCHAR(50) NOT NULL,
    "agreementType" "AgreementType" NOT NULL,
    "status" "AgreementStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "baseRentAmount" DECIMAL(10,2) NOT NULL,
    "typeSpecificData" JSONB,
    "noticePeriodDays" INTEGER NOT NULL DEFAULT 30,
    "autoRenewal" BOOLEAN NOT NULL DEFAULT false,
    "petsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "smokingAllowed" BOOLEAN NOT NULL DEFAULT false,
    "sublettingAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "metadata" JSONB,

    CONSTRAINT "RentalAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgreementStatusHistory" (
    "id" UUID NOT NULL,
    "agreementId" UUID NOT NULL,
    "previousStatus" "AgreementStatus" NOT NULL,
    "newStatus" "AgreementStatus" NOT NULL,
    "changedBy" UUID,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgreementStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaseAgreementDetails" (
    "id" UUID NOT NULL,
    "agreementId" UUID NOT NULL,
    "leaseTerm" INTEGER NOT NULL DEFAULT 12,
    "renewalOptions" JSONB,
    "rentEscalation" JSONB,
    "maintenanceTerms" TEXT,
    "leaseCompliance" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaseAgreementDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalAgreementDetails" (
    "id" UUID NOT NULL,
    "agreementId" UUID NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "flexibleTerms" BOOLEAN NOT NULL DEFAULT true,
    "minimumStay" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalAgreementDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortTermAgreementDetails" (
    "id" UUID NOT NULL,
    "agreementId" UUID NOT NULL,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "guestCapacity" INTEGER,
    "houseRules" TEXT,
    "bookingPlatform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShortTermAgreementDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgreementParticipant" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "agreementId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "participantType" "ParticipantType" NOT NULL,
    "responsibilityPercentage" DECIMAL(5,2),
    "status" "ParticipantStatus" NOT NULL DEFAULT 'ACTIVE',
    "moveInDate" TIMESTAMP(3),
    "moveOutDate" TIMESTAMP(3),
    "participantTerms" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "AgreementParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantStatusHistory" (
    "id" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "previousStatus" "ParticipantStatus" NOT NULL,
    "newStatus" "ParticipantStatus" NOT NULL,
    "changedBy" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantStatusHistory_pkey" PRIMARY KEY ("id")
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
    "applicationId" UUID NOT NULL,
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
CREATE TABLE "PropertyScreeningConfig" (
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

    CONSTRAINT "PropertyScreeningConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalCharge" (
    "id" UUID NOT NULL,
    "agreementId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "frequency" "ChargeFrequency" NOT NULL DEFAULT 'ONE_TIME',
    "mandatory" BOOLEAN NOT NULL DEFAULT true,
    "dueDate" TIMESTAMP(3),
    "chargeMetadata" JSONB,
    "voided" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdditionalCharge_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "TenantReference_applicationId_idx" ON "TenantReference"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "RentalApplication_applicationNumber_key" ON "RentalApplication"("applicationNumber");

-- CreateIndex
CREATE INDEX "RentalApplication_organizationId_idx" ON "RentalApplication"("organizationId");

-- CreateIndex
CREATE INDEX "RentalApplication_person_idx" ON "RentalApplication"("person");

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
CREATE UNIQUE INDEX "RentalAgreement_agreementNumber_key" ON "RentalAgreement"("agreementNumber");

-- CreateIndex
CREATE INDEX "RentalAgreement_organizationId_idx" ON "RentalAgreement"("organizationId");

-- CreateIndex
CREATE INDEX "RentalAgreement_propertyId_idx" ON "RentalAgreement"("propertyId");

-- CreateIndex
CREATE INDEX "RentalAgreement_status_idx" ON "RentalAgreement"("status");

-- CreateIndex
CREATE INDEX "RentalAgreement_agreementType_idx" ON "RentalAgreement"("agreementType");

-- CreateIndex
CREATE INDEX "RentalAgreement_startDate_endDate_idx" ON "RentalAgreement"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "AgreementStatusHistory_agreementId_key" ON "AgreementStatusHistory"("agreementId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaseAgreementDetails_agreementId_key" ON "LeaseAgreementDetails"("agreementId");

-- CreateIndex
CREATE UNIQUE INDEX "RentalAgreementDetails_agreementId_key" ON "RentalAgreementDetails"("agreementId");

-- CreateIndex
CREATE UNIQUE INDEX "ShortTermAgreementDetails_agreementId_key" ON "ShortTermAgreementDetails"("agreementId");

-- CreateIndex
CREATE INDEX "AgreementParticipant_organizationId_idx" ON "AgreementParticipant"("organizationId");

-- CreateIndex
CREATE INDEX "AgreementParticipant_agreementId_idx" ON "AgreementParticipant"("agreementId");

-- CreateIndex
CREATE INDEX "AgreementParticipant_tenantId_idx" ON "AgreementParticipant"("tenantId");

-- CreateIndex
CREATE INDEX "ParticipantStatusHistory_participantId_idx" ON "ParticipantStatusHistory"("participantId");

-- CreateIndex
CREATE INDEX "TenantDocument_organizationId_idx" ON "TenantDocument"("organizationId");

-- CreateIndex
CREATE INDEX "TenantDocument_tenantId_idx" ON "TenantDocument"("tenantId");

-- CreateIndex
CREATE INDEX "TenantDocument_documentType_idx" ON "TenantDocument"("documentType");

-- CreateIndex
CREATE INDEX "BackgroundCheckStatusHistory_applicationId_idx" ON "BackgroundCheckStatusHistory"("applicationId");

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
CREATE INDEX "PropertyScreeningConfig_organizationId_idx" ON "PropertyScreeningConfig"("organizationId");

-- CreateIndex
CREATE INDEX "PropertyScreeningConfig_listingId_idx" ON "PropertyScreeningConfig"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyScreeningConfig_listingId_key" ON "PropertyScreeningConfig"("listingId");

-- CreateIndex
CREATE INDEX "AdditionalCharge_agreementId_idx" ON "AdditionalCharge"("agreementId");

-- AddForeignKey
ALTER TABLE "TenantStatusHistory" ADD CONSTRAINT "TenantStatusHistory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantReference" ADD CONSTRAINT "TenantReference_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplicationStatusHistory" ADD CONSTRAINT "RentalApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoApplicant" ADD CONSTRAINT "CoApplicant_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgreementStatusHistory" ADD CONSTRAINT "AgreementStatusHistory_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "RentalAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaseAgreementDetails" ADD CONSTRAINT "LeaseAgreementDetails_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "RentalAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalAgreementDetails" ADD CONSTRAINT "RentalAgreementDetails_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "RentalAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortTermAgreementDetails" ADD CONSTRAINT "ShortTermAgreementDetails_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "RentalAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgreementParticipant" ADD CONSTRAINT "AgreementParticipant_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "RentalAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgreementParticipant" ADD CONSTRAINT "AgreementParticipant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantStatusHistory" ADD CONSTRAINT "ParticipantStatusHistory_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "AgreementParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantDocument" ADD CONSTRAINT "TenantDocument_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundCheckStatusHistory" ADD CONSTRAINT "BackgroundCheckStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningResponse" ADD CONSTRAINT "ScreeningResponse_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RentalApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningResponse" ADD CONSTRAINT "ScreeningResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ScreeningQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalCharge" ADD CONSTRAINT "AdditionalCharge_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "RentalAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
