import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/models/User";
import { Job } from "../../src/models/Job";
import jwt from "jsonwebtoken";
import { SECRET } from "../../src/middleware/auth";
import { connectDB, disconnectDB } from "../../src/config/db";

let adminToken: string;
let userToken: string;

beforeAll(async () => {
  await connectDB();
  // Clean DB and seed users
  await User.deleteMany({});
  await Job.deleteMany({});

  const adminUser = new User({
    username: "adminuser",
    password: "hashedpassword",
    isAdmin: true,
  });
  await adminUser.save();

  adminToken = jwt.sign(
    { id: adminUser._id.toString(), isAdmin: adminUser.isAdmin },
    SECRET,
    { expiresIn: "1d" }
  );

  // Create normal user
  const normalUser = new User({
    username: "normaluser",
    password: "hashedpassword",
    isAdmin: false,
  });
  await normalUser.save();

  userToken = jwt.sign(
    { id: normalUser._id.toString(), isAdmin: normalUser.isAdmin },
    SECRET,
    { expiresIn: "1d" }
  );
});

describe("Job routes", () => {
  describe("GET /api/jobs - list all jobs", () => {
    beforeEach(async () => {
      await Job.deleteMany({});
      await Job.insertMany([
        { title: "Dev", company: "A Corp", location: "Dhaka" },
        { title: "QA", company: "B Corp", location: "Chittagong" },
        { title: "Manager", company: "C Corp", location: "Sylhet" },
      ]);
    });

    afterEach(async () => {
      await Job.deleteMany({});
    });

    it("should return a list of all jobs", async () => {
      const res = await request(app).get("/api/jobs");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(1);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(3);

      expect(res.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: "Dev" }),
          expect.objectContaining({ title: "QA" }),
          expect.objectContaining({ title: "Manager" }),
        ])
      );
    });

    it("should return an empty array if no jobs exist", async () => {
      await Job.deleteMany({});

      const res = await request(app).get("/api/jobs");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(1);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe("POST /api/jobs - create job (admin only)", () => {
    it("should return 401 if no token provided", async () => {
      const res = await request(app).post("/api/jobs").send({
        title: "Developer",
        company: "Google",
        location: "Remote",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Missing token");
    });

    it("should return 403 if user is not admin", async () => {
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "Developer",
          company: "Google",
          location: "Remote",
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Unauthorized");
    });

    it("should return 422 if validation fails", async () => {
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "", // invalid title
          company: "OpenAI",
          location: "Remote",
        });

      expect(res.status).toBe(422);
      expect(res.body.status).toBe(0);
      expect(res.body.message).toBe("Validation failed");
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "title",
            message: expect.any(String),
          }),
        ])
      );
    });

    it("should create job successfully with valid data and admin token", async () => {
      const jobData = {
        title: "Developer",
        company: "Google",
        location: "Remote",
      };

      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(jobData);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe(1);
      expect(res.body.message).toBe(
        "New Job request has been created successfully."
      );
      expect(res.body.data).toMatchObject(jobData);
      expect(res.body.data).toHaveProperty("_id");
    });
  });

  describe("GET /api/jobs/:id - get job by ID", () => {
    let jobId: string;

    beforeEach(async () => {
      const job = new Job({
        title: "Tester",
        company: "QA Corp",
        location: "Dhaka",
      });
      await job.save();
      jobId = job._id.toString();
    });

    afterEach(async () => {
      await Job.deleteMany({});
    });

    it("should get a job successfully", async () => {
      const res = await request(app).get(`/api/jobs/${jobId}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(1);
      expect(res.body.message).toBe("Job retrieved successfully");
      expect(res.body.data).toHaveProperty("_id", jobId);
      expect(res.body.data.title).toBe("Tester");
    });

    it("should return 404 for non-existent job ID", async () => {
      const fakeId = "64f123abc123456789abc999"; // valid ObjectId format but no record

      const res = await request(app).get(`/api/jobs/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe(0);
      expect(res.body.message).toBe("Job not found");
    });

    it("should return 422 for invalid job ID format", async () => {
      const invalidId = "123invalid";

      const res = await request(app).get(`/api/jobs/${invalidId}`);

      expect(res.status).toBe(422);
      expect(res.body.status).toBe(0);
      expect(res.body.message).toBe(`Invalid job id: ${invalidId}`);
    });
  });
});
