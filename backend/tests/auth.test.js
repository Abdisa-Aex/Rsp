const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../server");
const User = require("../models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe("Authentication API", () => {
  let authToken;

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        fullName: "Test User",
        email: "test@example.com",
        password: "Password123!",
        userType: "student",
        studentId: "JU-2024-0001",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("Registration successful");
    });

    it("should not register with existing email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        fullName: "Test User 2",
        email: "test@example.com",
        password: "Password123!",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "Password123!",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token;
    });

    it("should not login with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should get current user profile", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("x-auth-token", authToken);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("test@example.com");
    });

    it("should not get profile without token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.statusCode).toBe(401);
    });
  });
});
