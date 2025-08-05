import { Request, Response } from "express";
import { Job } from "../models/Job";
import { authMiddleware } from "../middleware/auth";
import { JobSchema } from "../types/job";
import { validate } from "../utils/validate";
import mongoose from "mongoose";

const router = require("express").Router();
// Get all jobs
router.get("/", async (_: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    if (!jobs) {
      return res.json({ status: 0, message: "No jobs found" });
    }
    res.json({
      status: 1,
      message: "Jobs retrieved successfully",
      data: jobs,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a job by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(422).json({
      status: 0,
      message: `Invalid job id: ${id}`,
    });
  }

  try {
    const job = await Job.findById(id);
    if (!job)
      return res.status(404).json({ status: 0, message: "Job not found" });

    res.json({
      status: 1,
      message: "Job retrieved successfully",
      data: job,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Only admins can post new jobs
router.post(
  "/",
  authMiddleware,
  validate(JobSchema),
  async (req: Request, res: Response) => {
    try {
      // Create new Mongoose document from validated req.body
      const newJob = new Job(req.body);
      await newJob.save();

      res.status(201).json({
        status: 1,
        message: "New Job request has been created successfully.",
        data: newJob,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Something went wrong" });
    }
  }
);

export default router;
