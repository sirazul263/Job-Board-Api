import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { connectDB } from "../config/db";

async function createUser() {
  await connectDB();

  const username = "admin";
  const password = "admin123"; // plain password
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ username });
  if (existing) {
    console.log("User already exists");
    process.exit(0);
  }

  const user = new User({ username, password: hashedPassword, isAdmin: true });
  await user.save();

  console.log("User created successfully");
  process.exit(0);
}

createUser();
