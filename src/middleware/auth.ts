import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET) as {
      id: string;
      isAdmin: boolean;
    };
    if (!decoded.isAdmin) throw new Error("Not admin");

    // Attach user info to req for use in next middlewares/routes
    req.user = {
      id: decoded.id,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized" });
  }
};
