import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not set.");
    }
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGO_URL);

    if (conn?.connections[0].readyState === 1) {
      console.log("MongoDB connected!");
    } else {
      console.log("MongoDB connection failed.");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
