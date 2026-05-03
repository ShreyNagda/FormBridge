import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  password?: string;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default in queries
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret.password;
        return ret;
      },
    },
  },
);

// Virtual: populate forms from Form model
UserSchema.virtual("forms", {
  ref: "Form",
  localField: "_id",
  foreignField: "userId",
});

export const User: Model<IUser> =
  mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);
