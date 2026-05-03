import crypto from "crypto";
import mongoose, { type Model, Schema } from "mongoose";

const generateId = () => crypto.randomUUID();

export interface FormDocument {
  _id: string;
  name: string;
  userId: string;
  hashedApiKey?: string | null;
  apiKeyPreview?: string | null;
  allowedOrigins: string[];
  emailNotifications?: boolean;
  emailList?: string[] | null;
  redirectUrl?: string | null;
  honeypotField?: string | null;
  hCaptchaEnabled: boolean;
  hCaptchaSecret?: string | null;
  rateLimit?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const FormSchema = new Schema<FormDocument>(
  {
    _id: { type: String, default: generateId },
    name: { type: String, required: true },
    userId: { type: String, required: true },
    hashedApiKey: { type: String, default: null },
    apiKeyPreview: { type: String, default: null },
    allowedOrigins: { type: [String], default: [] },
    redirectUrl: { type: String, default: null },
    honeypotField: { type: String, default: null },
    hCaptchaEnabled: { type: Boolean, default: false },
    hCaptchaSecret: { type: String, default: null },
    rateLimit: { type: Number, default: 10 },
  },
  { timestamps: true, versionKey: false },
);

export const FormModel =
  (mongoose.models.Form as Model<FormDocument>) ||
  mongoose.model<FormDocument>("Form", FormSchema, "Form");

export interface SubmissionDocument {
  _id: string;
  formId: string;
  isSpam: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

const SubmissionSchema = new Schema<SubmissionDocument>(
  {
    _id: { type: String, default: generateId },
    formId: { type: String, ref: "Form", required: true },
    isSpam: { type: Boolean, default: false },
    data: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: () => new Date() },
  },
  { versionKey: false },
);

SubmissionSchema.index({ formId: 1, createdAt: -1 });

export const SubmissionModel =
  (mongoose.models.Submission as Model<SubmissionDocument>) ||
  mongoose.model<SubmissionDocument>(
    "Submission",
    SubmissionSchema,
    "Submission",
  );

export interface WebhookDocument {
  _id: string;
  formId: string;
  channel: string;
  config: Record<string, unknown>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WebhookSchema = new Schema<WebhookDocument>(
  {
    _id: { type: String, default: generateId },
    formId: { type: String, ref: "Form", required: true },
    channel: { type: String, required: true },
    config: { type: Schema.Types.Mixed, required: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

WebhookSchema.index({ formId: 1, createdAt: -1 });

export const WebhookModel =
  (mongoose.models.Webhook as Model<WebhookDocument>) ||
  mongoose.model<WebhookDocument>("Webhook", WebhookSchema, "Webhook");

export interface WebhookDeliveryDocument {
  _id: string;
  submissionId: string;
  webhookId: string;
  status: string;
  attempt: number;
  httpStatus?: number | null;
  responseBody?: string | null;
  nextRetryAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
}

const WebhookDeliverySchema = new Schema<WebhookDeliveryDocument>(
  {
    _id: { type: String, default: generateId },
    submissionId: { type: String, ref: "Submission", required: true },
    webhookId: { type: String, ref: "Webhook", required: true },
    status: { type: String, required: true },
    attempt: { type: Number, default: 0 },
    httpStatus: { type: Number, default: null },
    responseBody: { type: String, default: null },
    nextRetryAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    createdAt: { type: Date, default: () => new Date() },
  },
  { versionKey: false },
);

WebhookDeliverySchema.index({ status: 1, nextRetryAt: 1 });

export const WebhookDeliveryModel =
  (mongoose.models.WebhookDelivery as Model<WebhookDeliveryDocument>) ||
  mongoose.model<WebhookDeliveryDocument>(
    "WebhookDelivery",
    WebhookDeliverySchema,
    "WebhookDelivery",
  );

export interface RateLimitDocument {
  _id: string;
  identifier: string;
  windowStart: Date;
  count: number;
}

const RateLimitSchema = new Schema<RateLimitDocument>(
  {
    _id: { type: String, default: generateId },
    identifier: { type: String, required: true },
    windowStart: { type: Date, required: true },
    count: { type: Number, default: 0 },
  },
  { versionKey: false },
);

RateLimitSchema.index({ identifier: 1, windowStart: 1 }, { unique: true });

export const RateLimitModel =
  (mongoose.models.RateLimit as Model<RateLimitDocument>) ||
  mongoose.model<RateLimitDocument>("RateLimit", RateLimitSchema, "RateLimit");
