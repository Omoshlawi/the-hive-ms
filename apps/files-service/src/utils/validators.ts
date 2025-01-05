import { z } from "zod";

export const FilesSchema = z.object({
  path: z.string().min(1, "required"),
});
export const FilesCleanSchema = z.object({
  paths: z.array(z.string().min(1, "required")),
});
