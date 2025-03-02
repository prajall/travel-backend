import request from "supertest";
import app from "../../app.ts"; // Ensure this points to your Express app
import mongoose from "mongoose";
import Company from "./company.model.ts"; // Company model

describe("Company API Endpoints", () => {
  let testCompanyId: string;
  let authToken: string = ""; // Mock auth token if authentication is required

  beforeAll(async () => {
    // Ensure database connection before tests
    await mongoose.connect(
      "mongodb://admin:Clfa4ace7d+++.msoft@202.51.83.89:27017/travel?authSource=admin" as string
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /** ✅ CREATE COMPANY */
  it("should create a new company", async () => {
    const res = await request(app).post("/company").send({
      name: "Test Company",
      email: "testcompany@example.com",
      password: "securePass123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    testCompanyId = res.body.data._id; // Save for later tests
  });

  /** ❌ CREATE COMPANY (Duplicate Email) */
  it("should fail to create a company with a duplicate email", async () => {
    const res = await request(app).post("/company").send({
      name: "Test Company",
      email: "testcompany@example.com", // Duplicate email
      password: "securePass123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/email already exists/i);
  });

  //   /** ✅ GET ALL COMPANIES */
  it("should fetch all companies", async () => {
    const res = await request(app).get("/company");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /** ✅ GET SINGLE COMPANY */
  it("should fetch a single company by ID", async () => {
    const res = await request(app).get(`/company/${testCompanyId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", testCompanyId);
  });

  //   /** ❌ GET NON-EXISTENT COMPANY */
  it("should return 404 for a non-existent company", async () => {
    const res = await request(app).get(`/company/655555555555555555555555`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  //   /** ✅ UPDATE COMPANY */
  it("should update a company", async () => {
    const res = await request(app).put(`/company/${testCompanyId}`).send({
      name: "Updated Company Name",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Company Name");
  });

  //   /** ❌ UPDATE NON-EXISTENT COMPANY */
  it("should return 404 for updating a non-existent company", async () => {
    const res = await request(app)
      .put(`/company/655555555555555555555555`)
      .send({
        name: "Should Not Update",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  //   /** ✅ DELETE COMPANY */
  it("should delete a company", async () => {
    const res = await request(app).delete(`/company/${testCompanyId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  /** ❌ DELETE NON-EXISTENT COMPANY */
  it("should return 404 for deleting a non-existent company", async () => {
    const res = await request(app).delete(`/company/${testCompanyId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });
});
