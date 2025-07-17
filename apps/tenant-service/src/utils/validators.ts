import { PHONE_NUMBER_REGEX } from "@hive/core-utils";
import { z } from "zod";

export const TenantValidator = z.object({
  personId: z.string().nonempty().uuid("Invalid"),
  tenantType: z.enum([
    "INDIVIDUAL",
    "COUPLE",
    "FAMILY",
    "ROOMMATES",
    "CORPORATE",
  ]),
  monthlyIncome: z.coerce.number().nonnegative().optional(),
  employmentStatus: z
    .enum([
      "EMPLOYED_FULL_TIME",
      "EMPLOYED_PART_TIME",
      "SELF_EMPLOYED",
      "UNEMPLOYED",
      "RETIRED",
      "STUDENT",
      "CONTRACTOR",
    ])
    .optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactEmail: z.string().email().optional(),
  emergencyContactRelation: z.string().email().optional(),
  preferredContactMethod: z.enum(["EMAIL", "PHONE", "SMS", "MAIL"]).optional(),
  languagePreference: z.string().optional(),
  specialRequirements: z.string().optional(),
  internalNotes: z.string().optional(),
  tags: z.string().nonempty().array(),
});

export const TenenantReferenceValidator = z.object({
  referenceType: z.enum([
    "PERSONAL",
    "PROFESSIONAL",
    "PREVIOUS_LANDLORD",
    "EMPLOYER",
    "CHARACTER",
    "EMERGENCY_CONTACT",
  ]),
  name: z.string().nonempty(),
  relationship: z.string().nonempty(),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX).optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
});

export const CoApplicantValidator = z.object({
  personId: z.string().nonempty().uuid("Invalid"),
  relationshipType: z.string().nonempty(),
});

export const ScreeningQuestionValidator = z.object({
  question: z.string().nonempty(),
  questionType: z.enum([
    "TEXT",
    "TEXTAREA",
    "NUMBER",
    "BOOLEAN",
    "DATE",
    "EMAIL",
    "PHONE",
    "SINGLE_SELECT",
    "MULTI_SELECT",
    "CHECKBOX",
    "DROPDOWN",
    "FILE_UPLOAD",
    "CURRENCY",
    "PERCENTAGE",
    "URL",
    "TIME",
    "DATETIME",
    "RATING",
    "SLIDER",
    "SIGNATURE",
  ]),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().optional(),
});

export const RentalApplicationValidator = z.object({
  personId: z.string().nonempty().uuid("Invalid"),
  listingId: z.string().nonempty().uuid("Invalid"),
  desiredMoveInDate: z.coerce.date(),
  leaseTerm: z.coerce.number().nonnegative().optional(),
  proposedRent: z.coerce.number().nonnegative().optional(),
  securityDeposit: z.coerce.number().nonnegative().optional(),
  petDetails: z.string().optional(),
  vehicleInfo: z.string().optional(),
  coApplicants: CoApplicantValidator.array().optional(),
  references: TenenantReferenceValidator.array().optional(),
});

export const RentalApplicationStatusValidator = z.object({
  status: z.enum([
    "DRAFT",
    "PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "WITHDRAWN",
    "EXPIRED",
    "CONDITIONAL_APPROVAL",
  ]),
  reason: z.string(),
});
export const LeaseAgreementDetailsValidator = z.object({
  leaseTerm: z.coerce.number().int().nonnegative(),
});

export const RentalAgreementDetailsValidator = z.object({
  minimumStay: z.coerce.number().int().nonnegative(),
});
export const ShortTermAgreementDetailsValidator = z.object({
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  guestCapacity: z.coerce.number(),
});
export const tenantNumber = z
  .string()
  .regex(
    /^TNT-\d{6,12}$/,
    "Tenant number must follow the format 'TNT-######' (6–12 digits)"
  );
export const AgreementParticipantValudator = z.object({
  tenantId: z.string().nonempty().uuid("Invalid"),
  participantType: z.enum([
    "PRIMARY_TENANT",
    "CO_TENANT",
    "GUARANTOR",
    "OCCUPANT",
    "SUBLESSEE",
    "AUTHORIZED_OCCUPANT",
  ]),
  moveInDate: z.coerce.date(),
  moveOutDate: z.coerce.date(),
});

export const AdditionalChargeValidator = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  amount: z.coerce.number().nonnegative(),
  frequesncy: z.enum([
    "ONE_TIME",
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "QUARTERLY",
    "ANNUALLY",
    "PER_NIGHT",
    "PER_STAY",
  ]),
  mandatory: z.boolean().optional(),
  dueDate: z.coerce.date().optional(),
});

export const RentalAgreementValidator = z.object({
  applicationId: z.string().nonempty().uuid({ message: "Invalid" }),
  agreementType: z.enum([
    "LEASE",
    "RENTAL",
    "SHORT_TERM",
    "CORPORATE",
    "SHORT_TERM",
    "SUBLEASE",
    "COMMERCIAL",
    "RENT_TO_OWN",
    "STUDENT",
    "SENIOR",
  ]),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  noticePeriodDays: z.coerce.number().int().nonnegative(),
  baseRentAmount: z.coerce.number().int().nonnegative(),
  autoRenewal: z.boolean().optional(),
  petsAllowed: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
  sublettingAllowed: z.boolean().optional(),
  participants: AgreementParticipantValudator.array().nonempty(),
  additionalCharges: AdditionalChargeValidator.array().optional(),
  leaseDetails: LeaseAgreementDetailsValidator.optional(),
  rentalDetails: RentalAgreementDetailsValidator.optional(),
  shortTermDetails: ShortTermAgreementDetailsValidator.optional(),
});
