import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../src/config/db";

dotenv.config({ path: ".env" });

beforeAll(async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to DB");
    return;
  }
  console.log("Connecting to test database...");
  await connectDB(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  console.log("Disconnecting from test database...");
  await disconnectDB();
});

// Optional: clear DB before each test to avoid data conflicts
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
