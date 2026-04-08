import mongoose from "mongoose";

/**
 * Connects to MongoDB. Call once during app startup.
 * @param {string} uri
 */
export async function connectDb(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

export function getConnectionState() {
  return mongoose.connection.readyState;
}
