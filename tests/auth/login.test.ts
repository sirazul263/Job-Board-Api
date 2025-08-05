import request from "supertest";
import app from "../../src/app";

describe("POST /api/auth/login", () => {
  it("should fail with invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "invalid_user",
      password: "wrong_pass",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should return token with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "admin", //The only user exists in DB
      password: "admin123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", 1);
    expect(res.body).toHaveProperty("message", "Logged in Successfully");
    expect(res.body).toHaveProperty("token");
  });
});
