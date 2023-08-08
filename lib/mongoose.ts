import mongoose from "mongoose";

let isConnected = false; // checks if mongoose is connected

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.DATABASE_URL) {
    return console.log("MongoDB URL not found");
  }
  if (isConnected) return console.log("Already connected to database");

  try {
    await mongoose.connect(process.env.DATABASE_URL!);

    isConnected = true;

    console.log("Connected to mongodb");
  } catch (error) {
    console.log("MONGO_CONNECT_ERROR", error);
  }
};
