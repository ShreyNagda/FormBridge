import mongoose, { type Document, type Model, Schema } from "mongoose";

export const WEBHOOK_CHANNELS = ["DISCORD", "SLACK"] as const;

export type WebhookChannel = (typeof WEBHOOK_CHANNELS)[number];

export interface IWebhook extends Document {
  _id: mongoose.Types.ObjectId;
  formId: mongoose.Types.ObjectId;
  channel: WebhookChannel;
  config: Record<string, unknown>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WebhookSchema = new Schema<IWebhook>(
  {
    formId: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      required: [true, "Form ID is required"],
      index: true,
    },
    channel: {
      type: String,
      enum: WEBHOOK_CHANNELS,
      required: [true, "Channel is required"],
    },
    config: {
      type: Schema.Types.Mixed,
      required: [true, "Webhook configuration is required"],
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  },
);

// Index for finding webhooks by form
WebhookSchema.index({ formId: 1, enabled: 1 });

export const Webhook: Model<IWebhook> =
  mongoose.models?.Webhook ||
  mongoose.model<IWebhook>("Webhook", WebhookSchema);
