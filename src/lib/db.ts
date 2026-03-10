import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/groceryapp";

if (!mongoURI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

// Next.js hot reload fix: cache the connection
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const globalAny: any = global;

const connectDB = async () => {
  if (!globalAny.mongoose) {
    globalAny.mongoose = { conn: null, promise: null };
  }

  if (globalAny.mongoose.conn) {
    return globalAny.mongoose.conn;
  }

  if (!globalAny.mongoose.promise) {
    globalAny.mongoose.promise = mongoose
      .connect(mongoURI)
      .then((m) => m.connection)
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  try {
    globalAny.mongoose.conn = await globalAny.mongoose.promise;
    return globalAny.mongoose.conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectDB;