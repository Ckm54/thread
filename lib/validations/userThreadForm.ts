import * as z from "zod";

export const userThreadFormSchema = z.object({
  thread: z.string().min(3).max(280),
  accountId: z.string(),
});

export const commentValidationSchema = z.object({
  thread: z.string().min(3).max(280),
});
