import request from "supertest";
import app from "../../app.ts";
import mongoose from "mongoose";
import Company from "./company.model.ts";

describe("Company API Endpoints", () => {
  let testCompanyId: string;
  let authToken: string = "";

  beforeAll(async () => {
    await mongoose.connect(
      "mongodb://admin:Clfa4ace7d+++.msoft@202.51.83.89:27017/travel?authSource=admin"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /** CREATE COMPANY */
  it("should create a new company", async () => {
    const res = await request(app).post("/s-admin/company").send({
      name: "Test Company",
      email: "testcompany@example.com",
      password: "securePass123",
      modulesEnabled: [],
    });

    console.log(res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    testCompanyId = res.body.data._id; // Save for later tests
  });

  /** ❌ CREATE COMPANY (Duplicate Email) */
  it("should fail to create a company with a duplicate email", async () => {
    const res = await request(app).post("/s-admin/company").send({
      name: "Test Company",
      email: "testcompany@example.com", // Duplicate email
      password: "securePass123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/email already exists/i);
  });

  //    GET ALL COMPANIES
  it("should fetch all companies", async () => {
    const res = await request(app).get("/s-admin/company");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  //  GET SINGLE COMPANY
  it("should fetch a single company by ID and validate all required fields", async () => {
    const res = await request(app).get(`/s-admin/company/${testCompanyId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", testCompanyId);

    // Define the required fields
    const requiredFields = [
      "_id",
      "name",
      "email",
      "createdAt",
      "emailVerified",
      "updatedAt",
    ];

    // Check if all required fields exist
    requiredFields.forEach((field) => {
      expect(res.body.data).toHaveProperty(field);
    });

    // Validate specific values (example)
    expect(res.body.data._id).toBe(testCompanyId);
    expect(typeof res.body.data.name).toBe("string");
    expect(typeof res.body.data.email).toBe("string");
    // expect(typeof res.body.data.address).toBe("string");
    expect(typeof res.body.data.emailVerified).toBe("boolean");
    expect(new Date(res.body.data.createdAt)).toBeInstanceOf(Date);
    expect(new Date(res.body.data.updatedAt)).toBeInstanceOf(Date);
  });

  //   /**  GET NON-EXISTENT COMPANY */
  it("should return 404 for a non-existent company", async () => {
    const res = await request(app).get(
      `/s-admin/company/655555555555555555555555`
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  //   /** ✅ UPDATE COMPANY */
  it("should update a company", async () => {
    const res = await request(app)
      .put(`/s-admin/company/${testCompanyId}`)
      .send({
        name: "Updated Company Name",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Company Name");
  });

  //   /** ❌ UPDATE NON-EXISTENT COMPANY */
  it("should return 404 for updating a non-existent company", async () => {
    const res = await request(app)
      .put(`/s-admin/company/655555555555555555555555`)
      .send({
        name: "Should Not Update",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  //   /** ✅ DELETE COMPANY */
  it("should delete a company", async () => {
    const res = await request(app).delete(`/s-admin/company/${testCompanyId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  /** ❌ DELETE NON-EXISTENT COMPANY */
  it("should return 404 for deleting a non-existent company", async () => {
    const res = await request(app).delete(`/s-admin/company/${testCompanyId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });
});
