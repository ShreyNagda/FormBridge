import mongoose, { type Document, type Model, Schema } from "mongoose";

export const DELIVERY_STATUSES = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "RETRYING",
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export interface IWebhookDelivery extends Document {
  _id: mongoose.Types.ObjectId;
  submissionId: mongoose.Types.ObjectId;
  webhookId: mongoose.Types.ObjectId;
  status: DeliveryStatus;
  httpStatus?: number;
  responseBody?: string;
  attempt: number;
  nextRetryAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

const WebhookDeliverySchema = new Schema<IWebhookDelivery>(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: "Submission",
      required: [true, "Submission ID is required"],
      index: true,
    },
    webhookId: {
      type: Schema.Types.ObjectId,
      ref: "Webhook",
      required: [true, "Webhook ID is required"],
    },
    status: {
      type: String,
      enum: DELIVERY_STATUSES,
      required: [true, "Status is required"],
      default: "PENDING",
    },
    httpStatus: {
      type: Number,
    },
    responseBody: {
      type: String,
    },
    attempt: {
      type: Number,
      default: 1,
    },
    nextRetryAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  },
);

// Compound index for cron sweep: find retryable deliveries
WebhookDeliverySchema.index({ status: 1, nextRetryAt: 1 });

export const WebhookDelivery: Model<IWebhookDelivery> =
  mongoose.models?.WebhookDelivery ||
  mongoose.model<IWebhookDelivery>("WebhookDelivery", WebhookDeliverySchema);
