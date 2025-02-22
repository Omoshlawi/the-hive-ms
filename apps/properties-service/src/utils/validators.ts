import { optional, z } from "zod";

// IconSchema
const IconSchema = z.object({
  name: z.string().min(1, "Required"),
  family: z.string().min(1, "Required"),
});
// Amenity
export const AmenitySchema = z.object({
  name: z.string().min(1, "Required"),
  organizationId: z.string().uuid().optional(),
  icon: IconSchema,
});
export const AmenityFilterSchema = z.object({
  search: z.string().optional(),
  organizationId: z.string().uuid().optional(),
  icon: IconSchema,
});

// organization
export const OrganixationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Required"),
});

// Category
export const CategorySchema = z.object({
  name: z.string().min(1, "Required"),
  organizationId: z.string().uuid().optional(),
  icon: IconSchema,
});

// Property Media
export const PropertyMediaSchema = z.object({
  // propertyId: z.string().uuid(),
  type: z.enum(["Image", "Video", "Document", "Tour_3D"]),
  url: z.string().min(1, "Required"),
  title: z.string().min(1, "Required").optional(),
  description: z.string().min(1, "Required").optional(),
  order: z.number({ coerce: true }).int().nonnegative().optional(),
  metadata: z.object({
    size: z.number({
      coerce: true,
    }),
    memeType: z.string().min(1, "Required").optional(),
  }),
});

// Property Location
export const PropertyLocation = z.object({
  propertyId: z.string().uuid(),
  addressLine1: z.string().min(1, "Required"),
  addressLine2: z.string().min(1, "Required").optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),
  postalCode: z.string().min(1, "Required"),
  latitude: z.number({ coerce: true }).optional(),
  longitude: z.number({ coerce: true }).optional(),
  geospatialData: z.record(z.any()),
});

// Property
export const PropertySchema = z.object({
  name: z.string(),
  thumbnail: z.string().min(1, "Required"),
  attributes: z
    .array(
      z.object({
        attributeId: z.string().uuid(),
        value: z.string().min(1, "Required"),
      })
    )
    .optional(),
  addressId: z.string().uuid("invalid address"),
  media: z.array(PropertyMediaSchema).optional(),
  amenities: z.array(z.string().uuid()).optional(),
  categories: z.array(z.string().uuid()).optional(),
  description: z.string().optional(),
});

// Property
export const PropertyfiltersSchema = z.object({
  search: z.string().optional(),
});

// RelationshipType
export const RelationshipTypeSchema = z.object({
  description: z.string().min(1, "Required").optional(),
  aIsToB: z.string().min(1, "Required"),
  bIsToA: z.string().min(1, "Required"),
});

// Relationship
export const RelationshipSchema = z.object({
  propertyAId: z.string().uuid(),
  propertyBId: z.string().uuid(),
  startDate: z.date({ coerce: true }),
  endDate: z.date({ coerce: true }).optional(),
  typeId: z.string().uuid(),
});

// Relationship filters
export const RelationshipFilterSchema = z.object({
  propertyAId: z.string().uuid().optional(),
  propertyBId: z.string().uuid().optional(),
  propertyId: z.string().uuid().optional(),
  typeId: z.string().uuid().optional(),
  startDate: z.date({ coerce: true }).optional(),
  endDate: z.date({ coerce: true }).optional(),
});

// Attribute types
export const AttributeTypeSchema = z.object({
  name: z.string().min(1, "Required"),
  icon: IconSchema,
});

// Property Amenity
export const PropertyAmenitySchema = z.object({
  propertyId: z.string().uuid(),
  amenityId: z.string().uuid(),
});

// property category
export const PropertyCategorySchema = z.object({
  propertyId: z.string().uuid(),
  categoryId: z.string().uuid(),
});

// Property attribute
export const PropertyAttributeSchema = z.object({
  attributeId: z.string().uuid(),
  value: z.string().min(1, "Required"),
});
