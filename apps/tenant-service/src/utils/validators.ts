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
  monthlyIncome: z.number({ coerce: true }).nonnegative().optional(),
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
  ]),
  name: z.string().nonempty(),
  relationship: z.string().nonempty(),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX).optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
});

export const CoApplicantValidator = z.object({
  tenantNumber: z
    .string()
    .regex(
      /^TNT-\d{6,12}$/,
      "Tenant number must follow the format 'TNT-######' (6–12 digits)"
    )
    .optional(),
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
  sortOrder: z.number({ coerce: true }).optional(),
});

export const RentalApplicationValidator = z.object({
  tenantId: z.string().nonempty().uuid("Invalid"),
  listingId: z.string().nonempty().uuid("Invalid"),
  desiredMoveInDate: z.date({ coerce: true }),
  leaseTerm: z.number({ coerce: true }).nonnegative().optional(),
  proposedRent: z.number({ coerce: true }).nonnegative().optional(),
  securityDeposit: z.number({ coerce: true }).nonnegative().optional(),
  petDetails: z.string().optional(),
  vehicleInfo: z.string().optional(),
  coApplicants: CoApplicantValidator.array().optional(),
  references:TenenantReferenceValidator.array().optional()
});

export const LeaseAgreementDetailsValidator = z.object({
  leaseTerm: z.number({ coerce: true }).int().nonnegative(),
});

export const RentalAgreementDetailsValidator = z.object({
  minimumStay: z.number({ coerce: true }).int().nonnegative(),
});

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
  moveInDate: z.date({ coerce: true }),
  moveOutDate: z.date({ coerce: true }),
});

export const AdditionalChargeValidator = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  amount: z.number({ coerce: true }).nonnegative(),
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
  dueDate: z.date({ coerce: true }).optional(),
});

export const RentalAgreementValidator = z.object({
  propertyId: z.string().nonempty().uuid("Invalid"),
  agremeementType: z.enum([
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
  startDate: z.date({ coerce: true }),
  endDate: z.date({ coerce: true }).optional(),
  noticePeriodDays: z.number({ coerce: true }).int().nonnegative(),
  baseRentAmount: z.number({ coerce: true }).int().nonnegative(),
  autoRenewal: z.boolean().optional(),
  petsAllowed: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
  sublettingAllowed: z.boolean().optional(),
  participants: AgreementParticipantValudator.array().nonempty(),
  additionalCharges: AdditionalChargeValidator.array().optional(),
});
