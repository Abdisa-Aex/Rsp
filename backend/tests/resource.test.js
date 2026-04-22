const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../server");
const User = require("../models/User");

let authToken;
let userId;
let resourceId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const userRes = await request(app).post("/api/auth/register").send({
    fullName: "Resource Tester",
    email: "resourcetest@example.com",
    password: "Password123!",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "resourcetest@example.com",
    password: "Password123!",
  });
  authToken = loginRes.body.token;
  userId = loginRes.body.user.id;
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe("Resource API", () => {
  describe("POST /api/resources", () => {
    it("should create a new resource", async () => {
      const res = await request(app)
        .post("/api/resources")
        .set("x-auth-token", authToken)
        .send({
          title: "Test Power Drill",
          description: "A powerful cordless drill for DIY projects",
          category: "Tools",
          location: "Downtown",
          priceType: "rental",
          price: 25,
          condition: "good",
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.resource.title).toBe("Test Power Drill");
      resourceId = res.body.resource._id;
    });
  });

  describe("GET /api/resources", () => {
    it("should get all resources", async () => {
      const res = await request(app).get("/api/resources");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.resources)).toBe(true);
    });

    it("should filter by category", async () => {
      const res = await request(app).get("/api/resources?category=Tools");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/resources/:id", () => {
    it("should get resource by ID", async () => {
      const res = await request(app).get(`/api/resources/${resourceId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.resource._id).toBe(resourceId);
    });

    it("should return 404 for non-existent resource", async () => {
      const res = await request(app).get(
        `/api/resources/${new mongoose.Types.ObjectId()}`,
      );
      expect(res.statusCode).toBe(404);
    });
  });

  describe("PUT /api/resources/:id", () => {
    it("should update resource", async () => {
      const res = await request(app)
        .put(`/api/resources/${resourceId}`)
        .set("x-auth-token", authToken)
        .send({ title: "Updated Drill Name" });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.resource.title).toBe("Updated Drill Name");
    });
  });

  describe("DELETE /api/resources/:id", () => {
    it("should delete resource", async () => {
      const res = await request(app)
        .delete(`/api/resources/${resourceId}`)
        .set("x-auth-token", authToken);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
