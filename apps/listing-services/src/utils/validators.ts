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

export const SaleListingFinancingOptionSchema = z.object({
  // listingId: z.string().uuid("Invalid"),
  optionId: z.string().uuid("Invalid"),
});

export const SaleListingSchema = z.object({
  //   listingId: z.string().uuid(),
  downPayment: z.number({ coerce: true }).nonnegative().optional(),
  priceNegotiable: z.boolean().optional(),
  ownershipTypeId: z.string().uuid("Invalid"),
  titleDeedReady: z.boolean().optional(),
  financingOptions: z
    .string()
    .uuid("Invalid")
    .array()
    .nonempty("Atleast one payment option required"),
});

export const RentalListingSchema = z.object({
  //   listingId: z.string().uuid(),
  rentPeriod: z.enum(["Monthly", "Weekly", "Daily", "Yearly"]),
  minimumStay: z.number({ coerce: true }).nonnegative(),
  securityDeposit: z.number({ coerce: true }).nonnegative(),
  furnished: z.boolean().optional(),
  utilities: z.array(z.string().min(1, "Required")).optional(),
  availableFrom: z.date({ coerce: true }),
  //   additionalCharges: z.any().nullable(),
});

export const LeaseListingSchema = z.object({
  leaseTermInMoths: z.number({ coerce: true }).nonnegative(),
  securityDeposit: z.number({ coerce: true }).nonnegative(),
  renewalAllowed: z.boolean().optional(),
  allowedUses: z.array(z.string()).optional(),
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

export const ListingAdditionalCharges = z.object({
  // listingId: z.string().uuid("invalid"),
  name: z.string().nonempty("Required"),
  description: z.string().optional(),
  amount: z.number().nonnegative(),
  frequency: z.enum(["ONE_TIME", "MONTHLY", "WEEKLY", "PER_NIGHT", "ANNUALLY"]),
  mandatory: z.boolean(),
});
export const ListingSchema = z.object({
  propertyId: z.string().uuid(),
  tags: z.string().min(1, "Required").array().optional(),
  title: z.string().min(4),
  type: z.enum([
    "RENTAL",
    "SALE",
    "LEASE",
    "AUCTION",
    "RENT_TO_OWN",
    "SHORT_TERM",
    "CO_LIVING",
  ]),
  coverImage: z.string().optional(),
  description: z.string().optional(),
  price: z.number({ coerce: true }).nonnegative(),
  expiryDate: z.date({ coerce: true }).optional(),
  featured: z.boolean().optional(),
  contactPersonId: z.string().uuid(),
  saleDetails: SaleListingSchema.optional(),
  rentalDetails: RentalListingSchema.optional(),
  leaseDetails: LeaseListingSchema.optional(),
  auctionDetails: AuctionListingSchema.optional(),
  additionalCharges: ListingAdditionalCharges.array().optional(),
});

export const OwnershipTypeSchema = z.object({
  name: z.string().nonempty("required"),
  description: z.string().optional(),
});

export const FinancingOptionSchema = z.object({
  name: z.string().nonempty("required"),
  description: z.string().optional(),
});

export const ListingFilterSchema = z.object({
  search: z.string().optional(),
  tags: z.string().array().optional(),
  status: z
    .enum([
      "DRAFT",
      "PENDING",
      "BLOCKED",
      "APPROVED",
      "REJECTED",
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
    .enum([
      "RENTAL",
      "SALE",
      "LEASE",
      "AUCTION",
      "RENT_TO_OWN",
      "SHORT_TERM",
      "CO_LIVING",
    ])
    .array()
    .optional(),
  amenities: z.string().array().optional(),
  categories: z.string().array().optional(),
  // attributes: z
  //   .string()
  //   .regex(/^\s*([^:]+:[^,]+)(,\s*[^:]+:[^,]+)*\s*$/)
  //   .optional(),
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
