import { z } from "zod";
import { WEBHOOK_CHANNELS } from "@/lib/db/models/webhook";

export const webhookSchema = z.object({
  channel: z.enum(WEBHOOK_CHANNELS),
  enabled: z.boolean().default(true),
  config: z.record(z.unknown()),
});

export const createWebhookSchema = webhookSchema;
export const updateWebhookSchema = webhookSchema.partial();
