import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.DB_URL;

  if (!uri) {
    throw new Error("DB_URL is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
