import { z } from "zod";

export const createPromptSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(10).max(6000),
  visibility: z.enum(["PUBLIC", "UNLISTED"]),
});
