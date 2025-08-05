import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { SECRET } from "../middleware/auth";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id.toString(), isAdmin: user.isAdmin },
    SECRET,
    { expiresIn: "1d" }
  );
  return res.json({
    status: 1,
    message: "Logged in Successfully",
    token: token,
  });
});

export default router;
