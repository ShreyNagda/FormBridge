import { connectDB } from "@/lib/db";
import { Form, type IForm } from "@/lib/db/models/form";
import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Get all forms belonging to a user.
 */
export async function getFormsByUser(userId: string) {
  await connectDB();
  return Form.find({ userId })
    .sort({ createdAt: -1 })
    .lean<IForm[]>();
}

/**
 * Get a single form by its ID.
 */
export async function getFormById(formId: string) {
  await connectDB();
  return Form.findById(formId).lean<IForm | null>();
}

/**
 * Get a form by its API key (for submission endpoint).
 */
export async function getFormByApiKey(apiKey: string) {
  await connectDB();
  return Form.findOne({ apiKey }).lean<IForm | null>();
}

/**
 * Create a new form with a generated API key.
 */
export async function createForm(data: {
  userId: string;
  name: string;
  allowedOrigins?: string[];
  redirectSuccess?: string;
  redirectFailure?: string;
  honeypotField?: string;
  hcaptchaSecret?: string;
  rateLimit?: number;
}) {
  await connectDB();

  // Generate a unique API key
  const rawKey = `sk_${crypto.randomBytes(24).toString("hex")}`;
  const hashedKey = await bcrypt.hash(rawKey, 10);
  const preview = `${rawKey.slice(0, 7)}...${rawKey.slice(-4)}`;

  const form = await Form.create({
    ...data,
    apiKey: hashedKey,
    apiKeyPreview: preview,
  });

  // Return both the form and the raw key (only shown once)
  return {
    form: form.toJSON(),
    rawApiKey: rawKey,
  };
}

/**
 * Update a form by ID.
 */
export async function updateForm(
  formId: string,
  data: Partial<
    Pick<
      IForm,
      | "name"
      | "allowedOrigins"
      | "redirectSuccess"
      | "redirectFailure"
      | "honeypotField"
      | "hcaptchaSecret"
      | "rateLimit"
    >
  >,
) {
  await connectDB();
  return Form.findByIdAndUpdate(formId, { $set: data }, { new: true }).lean<IForm | null>();
}

/**
 * Delete a form and all its related data.
 */
export async function deleteForm(formId: string) {
  await connectDB();

  // Import here to avoid circular dependencies
  const { Submission } = await import("@/lib/db/models/submission");
  const { Webhook } = await import("@/lib/db/models/webhook");
  const { WebhookDelivery } = await import("@/lib/db/models/webhook-delivery");

  // Get submission IDs for cascading webhook delivery deletion
  const submissions = await Submission.find({ formId }).select("_id").lean();
  const submissionIds = submissions.map((s) => s._id);

  // Get webhook IDs for cascading webhook delivery deletion
  const webhooks = await Webhook.find({ formId }).select("_id").lean();
  const webhookIds = webhooks.map((w) => w._id);

  // Cascade delete
  await Promise.all([
    WebhookDelivery.deleteMany({
      $or: [
        { submissionId: { $in: submissionIds } },
        { webhookId: { $in: webhookIds } },
      ],
    }),
    Submission.deleteMany({ formId }),
    Webhook.deleteMany({ formId }),
    Form.findByIdAndDelete(formId),
  ]);
}
