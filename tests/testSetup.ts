import dotenv from "dotenv";
import { connectDB, disconnectDB } from "../src/config/db";
import { User } from "../src/models/User";
import { Job } from "../src/models/Job";

dotenv.config();

beforeAll(async () => {
  console.log("Connecting to test database...");
  await connectDB();
});

afterAll(async () => {
  console.log("Cleaning up test data...");
  await User.deleteMany({});
  await Job.deleteMany({});
  await Job.deleteMany({ _id: { $in: ["6891a10516e7b53cb5fb10f6"] } });
  console.log("Disconnecting from test database...");
  await disconnectDB();
});
