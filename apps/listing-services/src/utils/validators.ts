import { date, z } from "zod";

export const ListingMediaSchema = z.object({
  //   listingId: z.string().uuid(),
  tags: z.string().min(1, "Required").array().optional(),
  url: z.string().min(1, "Required"),
  title: z.string().min(1, "Required").optional(),
  description: z.string().min(1, "Required").optional(),
  order: z.number({ coerce: true }).int().nonnegative().optional(),
  metadata: z.object({
    size: z
      .number({
        coerce: true,
      })
      .nonnegative(),
    memeType: z.string().min(1, "Required").optional(),
  }),
});

export const SaleListingSchema = z.object({
  //   listingId: z.string().uuid(),
  downPayment: z.number({ coerce: true }).nonnegative().optional(),
  mortgageAvailable: z.boolean().optional(),
  priceNegotiable: z.boolean().optional(),
  ownershipType: z.enum(["Freehold", "Leasehold"]),
  titleDeedReady: z.boolean().optional(),
  financingOptions: z
    .enum(["Cash", "Mortgage", "Installments"]) // TODO Think of additional model with more info
    .array()
    .nonempty("Atleast one payment option required"),
});

export const RentalListingSchema = z.object({
  //   listingId: z.string().uuid(),
  rentPeriod: z.enum(["Monthly", "Weekly", "Daily", "Yearly"]),
  minimumRentalPeriod: z.number({ coerce: true }).nonnegative(),
  securityDeposit: z.number({ coerce: true }).nonnegative(),
  petsAllowed: z.boolean().optional(),
  furnished: z.boolean().optional(),
  utilities: z.array(z.string().min(1, "Required")).optional(),
  availableFrom: z.date({ coerce: true }),
  //   additionalCharges: z.any().nullable(),
});

export const LeaseListingSchema = z.object({
  leaseTerm: z.number({ coerce: true }).nonnegative(),
  securityDeposit: z.number({ coerce: true }).nonnegative(),
  maintenanceTerms: z.string().optional(),
  renewalOptions: z
    .object({
      renewalAllowed: z.boolean(),
      increaseRate: z.number({ coerce: true }).nonnegative(),
      maxRenewals: z.number({ coerce: true }).optional().nullable(),
    })
    .optional(),
  allowedUses: z.array(z.string()).optional(),
  isCommercial: z.boolean().optional(),
  buildOutAllowance: z.number({ coerce: true }).nonnegative().optional(),
});

export const AuctionListingSchema = z.object({
  startingBid: z.number({ coerce: true }).nonnegative(),
  reservePrice: z.number({ coerce: true }).nonnegative().optional(),
  bidIncrement: z.number({ coerce: true }).nonnegative(),
  auctionStart: z.date({ coerce: true }),
  auctionEnd: z.date({ coerce: true }),
  requirePreRegistration: z.boolean().optional(),
  requireBidderApproval: z.boolean().optional(),
});
export const ListingSchema = z.object({
  propertyId: z.string().uuid(),
  tags: z.string().min(1, "Required").array().optional(),
  status: z
    .enum([
      "DRAFT",
      "ACTIVE",
      "UNDER_CONTRACT",
      "SOLD",
      "LEASED",
      "RENTED",
      "WITHDRAWN",
      "EXPIRED",
    ])
    .optional(),
  title: z.string().min(4),
  description: z.string().optional(),
  price: z.number({ coerce: true }).nonnegative(),
  currency: z.string().optional(),
  listedDate: z.date({ coerce: true }).optional(),
  expiryDate: z.date({ coerce: true }).optional(),
  featured: z.boolean().optional(),
  contactPersonId: z.string().uuid(),
  saleDetails: SaleListingSchema.optional(),
  rentalDetails: RentalListingSchema.optional(),
  leaseDetails: LeaseListingSchema.optional(),
  auctionDetails: AuctionListingSchema.optional(),
});
export const ListingFilterSchema = z.object({
  search: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((a) =>
      a
        ?.split(",")
        ?.map((a) => a.trim())
        ?.filter(Boolean)
        ?.join(",")
    ),
  status: z
    .enum([
      "DRAFT",
      "ACTIVE",
      "UNDER_CONTRACT",
      "SOLD",
      "LEASED",
      "RENTED",
      "WITHDRAWN",
      "EXPIRED",
    ])
    .optional(),
  minPrice: z.number({ coerce: true }).nonnegative().optional(),
  maxPrice: z.number({ coerce: true }).nonnegative().optional(),
  listedDateStart: z.date({ coerce: true }).optional(),
  listedDateEnd: z.date({ coerce: true }).optional(),
  expiryDateStart: z.date({ coerce: true }).optional(),
  expiryDateEnd: z.date({ coerce: true }).optional(),
  types: z
    .string()
    .optional()
    .refine((data) => {
      if (!data) return true;
      if (
        data
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .every((d) => ["sale", "rental", "lease", "auction"].includes(d))
      ) {
        return true;
      }
      return false;
    })
    .transform((a) =>
      a
        ?.split(",")
        ?.map((a) => a.trim())
        ?.filter(Boolean)
        ?.join(",")
    ),
  amenities: z
    .string()
    .optional()
    .transform((a) =>
      a
        ?.split(",")
        ?.map((a) => a.trim())
        ?.filter(Boolean)
        ?.join(",")
    ),
  categories: z
    .string()
    .optional()
    .transform((a) =>
      a
        ?.split(",")
        ?.map((a) => a.trim())
        ?.filter(Boolean)
        ?.join(",")
    ),
  attributes: z
    .string()
    .regex(/^\s*([^:]+:[^,]+)(,\s*[^:]+:[^,]+)*\s*$/)
    .optional(),
});

// TODO  cKEAN FIELDS AFTER MODEL ANALYSIS

export const RentToOwnListingSchema = z.object({
  totalPurchasePrice: z.number({ coerce: true }).nonnegative(),
  monthlyRent: z.number({ coerce: true }).nonnegative(),
  rentCredits: z.number({ coerce: true }).nonnegative(),
  optionFee: z.number({ coerce: true }).nonnegative(),
  optionPeriod: z.number({ coerce: true }).nonnegative(),
  requiredDownPayment: z.number({ coerce: true }).nonnegative(),
  maintenanceTerms: z.string().optional(),
  purchaseTerms: z.string().optional(),
  minimumIncome: z.number().optional(),
  creditScoreRequired: z.number().optional(),
});

export const ShortTermListingSchema = z.object({
  minimumStay: z.number({ coerce: true }).nonnegative(),
  maximumStay: z.number({ coerce: true }).nonnegative().optional(),
  basePrice: z.number({ coerce: true }).nonnegative(),
  weeklyDiscount: z.number({ coerce: true }).nonnegative().optional(),
  monthlyDiscount: z.number({ coerce: true }).nonnegative().optional(),
  securityDeposit: z.number(),
  selfCheckIn: z.boolean().default(false),
  housekeeping: z.boolean().default(false),
  housekeepingInterval: z.number().nullable(),
  breakfast: z.boolean().default(false),
  quietHours: z.any().nullable(),
  partiesAllowed: z.boolean().default(false),
  smokingAllowed: z.boolean().default(false),
  availabilityCalendar: z.any().nullable(),
  checkInTime: z.string().nullable(),
  checkOutTime: z.string().nullable(),
});

export const CoLivingListingSchema = z.object({
  roomType: z.string(),
  totalOccupancy: z.number(),
  currentOccupancy: z.number(),
  privateSpace: z.number(),
  sharedSpace: z.number(),
  communityAmenities: z.any().nullable(),
  communityEvents: z.boolean().default(false),
  coworkingSpace: z.boolean().default(false),
  minimumStay: z.number(),
  genderPreference: z.string().nullable(),
  ageRange: z.any().nullable(),
  occupation: z.string().nullable(),
  houseCleaning: z.any().nullable(),
  guestPolicy: z.string().nullable(),
  quietHours: z.any().nullable(),
  communityGuidelines: z.string().nullable(),
  securityDeposit: z.number(),
  utilitiesIncluded: z.any().nullable(),
  additionalFees: z.any().nullable(),
});
