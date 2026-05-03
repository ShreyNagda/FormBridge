import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IForm extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  apiKey: string;
  apiKeyPreview: string;
  allowedOrigins: string[];
  redirectSuccess?: string;
  redirectFailure?: string;
  honeypotField: string;
  hcaptchaSecret?: string;
  rateLimit: number;
  emailNotifications: boolean;
  notificationEmails: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FormSchema = new Schema<IForm>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Form name is required"],
      trim: true,
    },
    apiKey: {
      type: String,
      required: [true, "API key is required"],
      unique: true,
    },
    apiKeyPreview: {
      type: String,
      required: [true, "API key preview is required"],
    },
    allowedOrigins: {
      type: [String],
      default: [],
    },
    redirectSuccess: {
      type: String,
    },
    redirectFailure: {
      type: String,
    },
    honeypotField: {
      type: String,
      default: "_gotcha",
    },
    hcaptchaSecret: {
      type: String,
    },
    rateLimit: {
      type: Number,
      default: 60,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    notificationEmails: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  },
);

// Virtual: submission count (populated on demand)
FormSchema.virtual("submissions", {
  ref: "Submission",
  localField: "_id",
  foreignField: "formId",
  count: true,
});

// Indexes
FormSchema.index({ userId: 1, createdAt: -1 });

export const Form: Model<IForm> =
  mongoose.models?.Form || mongoose.model<IForm>("Form", FormSchema);
