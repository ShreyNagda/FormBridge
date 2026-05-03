import mongoose from "mongoose";

/**
 * Mongoose connection singleton with caching for serverless environments.
 * Uses globalThis to persist the connection across hot reloads in development.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not defined. Please set it in your .env.local file.",
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as {
  mongoose: MongooseCache | undefined;
};

export async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if already connected
  if (globalForMongoose.mongoose?.conn) {
    return globalForMongoose.mongoose.conn;
  }

  // Initialize cache if not present
  if (!globalForMongoose.mongoose) {
    globalForMongoose.mongoose = { conn: null, promise: null };
  }

  // Create a new connection promise if not already connecting
  if (!globalForMongoose.mongoose.promise) {
    if (process.env.NODE_ENV === "development") {
      console.log("[MongoDB] Connecting to database...");
    }

    globalForMongoose.mongoose.promise = mongoose
      .connect(MONGODB_URI!, {
        bufferCommands: false,
      })
      .then((m) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[MongoDB] Connected successfully.");
        }
        return m;
      });
  }

  try {
    globalForMongoose.mongoose.conn = await globalForMongoose.mongoose.promise;
  } catch (error) {
    // Reset promise on failure so next call retries
    globalForMongoose.mongoose.promise = null;
    throw error;
  }

  return globalForMongoose.mongoose.conn;
}
