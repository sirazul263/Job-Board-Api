import request from "supertest";
import app from "../../src/app";
import { connectDB } from "../../src/config/db";
import { Job } from "../../src/models/Job";

beforeAll(async () => {
  await connectDB();
  // Insert a job that matches newApplication.jobId
  await Job.create({
    _id: "6891a10516e7b53cb5fb10f6",
    title: "Tester",
    company: "QA Corp",
    location: "Dhaka",
  });
});

describe("Applications API - Create Application", () => {
  it("should create a new application", async () => {
    const newApplication = {
      jobId: "6891a10516e7b53cb5fb10f6",
      applicantName: "John Doe",
      applicantEmail: "john@example.com",
      resumeUrl: "http://example.com/resume.pdf",
    };

    const res = await request(app)
      .post("/api/applications")
      .send(newApplication);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe(1);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.applicantName).toBe(newApplication.applicantName);
  });

  it("should fail to create application with invalid data", async () => {
    const invalidApplication = {
      jobId: "", // invalid jobId
      applicantName: "",
      applicantEmail: "not-an-email",
      resumeUrl: "not-a-url",
    };

    const res = await request(app)
      .post("/api/applications")
      .send(invalidApplication);

    expect(res.status).toBe(422); // Assuming validation returns 422
    expect(res.body.status).toBe(0);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 404 if job does not exist", async () => {
    const applicationWithNonExistentJob = {
      jobId: "64f1a8b9c123456789abcfff", // Non-existent job ID
      applicantName: "Jane Doe",
      applicantEmail: "jane@example.com",
      resumeUrl: "http://example.com/resume.pdf",
    };

    const res = await request(app)
      .post("/api/applications")
      .send(applicationWithNonExistentJob);

    expect(res.status).toBe(404);
    expect(res.body.status).toBe(0);
    expect(res.body.message).toBe("Job not found");
  });
});
