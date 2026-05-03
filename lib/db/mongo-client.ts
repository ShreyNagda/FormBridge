import { MongoClient } from "mongodb";

/**
 * Raw MongoClient singleton for NextAuth MongoDBAdapter.
 * The adapter requires a raw MongoClient, not a Mongoose connection.
 * Uses globalThis to cache the promise across hot reloads in development.
 *
 * The promise is lazily created and errors are caught to prevent
 * unhandled rejection crashes when MongoDB is unreachable.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not defined. Please set it in your .env.local file.",
  );
}

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise: Promise<MongoClient> | undefined;
};

if (!globalForMongo._mongoClientPromise) {
  const client = new MongoClient(MONGODB_URI);
  globalForMongo._mongoClientPromise = client.connect().catch((err) => {
    // Reset so the next import/call retries the connection
    globalForMongo._mongoClientPromise = undefined;
    throw err;
  });
}

export const clientPromise = globalForMongo._mongoClientPromise;
