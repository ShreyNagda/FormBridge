import { z } from "zod";

export const createFormSchema = z.object({
  name: z.string().min(1, "Form name is required"),
  allowedOrigins: z.array(z.string()).optional().default([]),
  redirectSuccess: z.string().url().optional().or(z.literal("")),
  redirectFailure: z.string().url().optional().or(z.literal("")),
  honeypotField: z.string().default("_gotcha"),
  hcaptchaSecret: z.string().optional(),
  rateLimit: z.number().min(1).max(300).default(60),
  emailNotifications: z.boolean().default(true),
  notificationEmails: z.array(z.string().email("Invalid email")).default([]),
});

export const updateFormSchema = createFormSchema.partial();

export type CreateFormInput = z.infer<typeof createFormSchema>;
export type UpdateFormInput = z.infer<typeof updateFormSchema>;
