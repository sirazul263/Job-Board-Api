import request from "supertest";
import app from "../../src/app";
import { Application } from "../../src/models/Application";
import { Job } from "../../src/models/Job";

describe("Applications API - Create Application", () => {
  beforeEach(async () => {
    await Application.deleteMany({});
    await Job.deleteMany({});
    // Create the test job before each test so it always exists
    await Job.create({
      _id: "6891a10516e7b53cb5fb10f6",
      title: "Test Job",
      company: "Test Company",
      location: "Test Location",
    });
  });

  it("should create a new application", async () => {
    const newApplication = {
      jobId: "6891a10516e7b53cb5fb10f6",
      applicantName: "John Doe",
      applicantEmail: "john.unique@example.com",
      resumeUrl: "https://example.com/resume.pdf",
    };

    const res = await request(app)
      .post("/api/applications")
      .send(newApplication);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe(1);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.applicantEmail).toBe(newApplication.applicantEmail);
  });

  it("should fail to create application with invalid data", async () => {
    const res = await request(app).post("/api/applications").send({
      applicantName: "",
      applicantEmail: "not-an-email",
      jobId: "",
      resumeUrl: "",
    });

    expect(res.status).toBe(422);
    expect(res.body.status).toBe(0);
    expect(res.body.message).toBe("Validation failed");
  });

  it("should return 404 if job does not exist", async () => {
    const res = await request(app).post("/api/applications").send({
      jobId: "64f123abc123456789abc999",
      applicantName: "Jane Smith",
      applicantEmail: "jane@example.com",
      resumeUrl: "https://example.com/jane.pdf",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Job not found");
  });

  it("should return 409 if the same email has already applied for the job", async () => {
    const application = {
      jobId: "6891a10516e7b53cb5fb10f6",
      applicantName: "John Doe",
      applicantEmail: "john@example.com",
      resumeUrl: "https://example.com/resume.pdf",
    };

    // Make sure the job exists before creating applications
    const job = await Job.findById(application.jobId);
    expect(job).not.toBeNull();

    // Create first application (should succeed)
    await request(app).post("/api/applications").send(application);

    // Create second application (should fail with 409 conflict)
    const res = await request(app).post("/api/applications").send(application);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("You have already applied for this job.");
  });
});
