import { Request, Response } from "express";
import { Application } from "../models/Application";
import { ApplicationSchema } from "../types/application";
import { validate } from "../utils/validate";
import { Job } from "../models/Job";

const router = require("express").Router();

router.post(
  "/",
  validate(ApplicationSchema),
  async (req: Request, res: Response) => {
    try {
      // Check if referenced job exists
      const jobExists = await Job.findById(req.body.jobId);
      if (!jobExists) {
        return res.status(404).json({ status: 0, message: "Job not found" });
      }

      const newApp = new Application(req.body);
      await newApp.save();
      res.status(201).json({
        status: 1,
        message: "Job Application submitted successfully.",
        data: newApp,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ status: 0, message: error.message || "Internal server error" });
    }
  }
);

export default router;
