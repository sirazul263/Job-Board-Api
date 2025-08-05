import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI environment variable not set");

  let tries = 3;
  while (tries > 0) {
    try {
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected");
      return;
    } catch (err) {
      tries--;
      if (tries === 0) throw err;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};
