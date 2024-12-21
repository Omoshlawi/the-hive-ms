import { z } from "zod";

export const IconFamilySchema = z.object({
  family: z.string().min(1, "Required"),
});

export const IconSchema = z.object({
  familyId: z.string().uuid(),
  name: z.string().min(1, "Required"),
});

export const CountyFilterSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  search: z.string().optional(),
});

export const SubCountyFilterSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  countyCode: z.string().optional(),
  county: z.string().optional(),
  search: z.string().optional(),
});

export const WardFilterSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  countyCode: z.string().optional(),
  subCountyCode: z.string().optional(),
  county: z.string().optional(),
  subCounty: z.string().optional(),
  search: z.string().optional(),
});

export const AddressFilterSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  county: z.string().optional(),
  subCounty: z.string().optional(),
  ward: z.string().optional(),
  village: z.string().optional(),
  ownerUserId: z.string().optional(),
  organizationId: z.string().optional(),
  search: z.string().optional(),
});
