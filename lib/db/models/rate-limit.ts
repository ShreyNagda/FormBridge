import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IRateLimit extends Document {
  _id: mongoose.Types.ObjectId;
  identifier: string;
  count: number;
  windowStart: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    identifier: {
      type: String,
      required: [true, "Rate limit identifier is required"],
    },
    count: {
      type: Number,
      default: 1,
    },
    windowStart: {
      type: Date,
      required: [true, "Window start is required"],
    },
  },
  {
    versionKey: false,
  },
);

// Compound unique index for rate limiting
RateLimitSchema.index({ identifier: 1, windowStart: 1 }, { unique: true });

// TTL index: auto-delete documents 60 seconds after windowStart
RateLimitSchema.index({ windowStart: 1 }, { expireAfterSeconds: 60 });

export const RateLimit: Model<IRateLimit> =
  mongoose.models?.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
