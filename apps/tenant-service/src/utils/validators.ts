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

export const RentalApplicationValidator = z.object({
  tenantId: z.string().nonempty().uuid("Invalid"),
  listingId: z.string().nonempty().uuid("Invalid"),
  desiredMoveInDate: z.date({ coerce: true }),
  leaseTerm: z.number({ coerce: true }).nonnegative().optional(),
  proposedRent: z.number({ coerce: true }).nonnegative().optional(),
  securityDeposit: z.number({ coerce: true }).nonnegative().optional(),
  petDetails: z.string().optional(),
  vehicleInfo: z.string().optional(),
});

export const CoApplicantValidator = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX).optional(),
  dateOfBirth: z.date({ coerce: true }).max(new Date()).optional(),
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
});
