import { z } from "zod";
export const ServiceSchema = z.object({
  name: z.string().min(1, "Required"),
  version: z.string().min(1, "Required"),
  port: z.number({ coerce: true }),
  host: z.string().optional(),
});
