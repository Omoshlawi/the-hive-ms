import { z } from "zod";

export const IconFamilySchema = z.object({
  family: z.string().min(1, "Required"),
});

export const IconSchema = z.object({
  familyId: z.string().uuid(),
  name: z.string().min(1, "Required"),
});
