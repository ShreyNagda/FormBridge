import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface ISubmission extends Document {
  _id: mongoose.Types.ObjectId;
  formId: mongoose.Types.ObjectId;
  data: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  spam: boolean;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    formId: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      required: [true, "Form ID is required"],
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: [true, "Submission data is required"],
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    spam: {
      type: Boolean,
      default: false,
      index: true,
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
        // ret.id = ret._id.toString();
        return ret;
      },
    },
  },
);

// Indexes for efficient querying
SubmissionSchema.index({ formId: 1, createdAt: -1 });
SubmissionSchema.index({ formId: 1, spam: 1, createdAt: -1 });

export const Submission: Model<ISubmission> =
  mongoose.models?.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);
