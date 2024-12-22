import { z } from "zod";

export const FilesSchema = z.object({
  path: z.string().min(1, "required"),
});
