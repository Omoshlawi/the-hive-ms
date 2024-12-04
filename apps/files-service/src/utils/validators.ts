import { z } from "zod";

export const FilesSchema = z.object({
  path: z.string().min(1, "required"),
  mbSize: z.number({ coerce: true }),
  memeType: z.string().min(1, "required"),
  organizationId: z.string().uuid(),
});
