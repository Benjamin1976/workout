import mongoose from "mongoose";
import config from "config";

console.log("env: " + process.env.NODE_ENV);

let uri: string | null | undefined =
  process?.env?.NODE_ENV === "production"
    ? process.env.MONGODB_URI?.toString()
    : config.get("mongoURI_local");

if (!uri) process.exit(1);
const db: string = uri;

const connectDB = async () => {
  try {
    await mongoose.connect(db, { family: 4 });

    console.log("MongoDB Connected...");
  } catch (err: any) {
    console.error("MongoDB Issue - " + err.message);
    process.exit(1);
  }
};

export default connectDB;
