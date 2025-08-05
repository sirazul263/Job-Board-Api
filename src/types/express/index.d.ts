import express from "express";
// For adding type-safe support for req.user.
// Used in authentication middleware.

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        isAdmin: boolean;
      };
    }
  }
}
