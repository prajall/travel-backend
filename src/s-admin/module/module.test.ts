import request from "supertest";
import app from "../../app.ts"; // Ensure this points to your Express app
import mongoose from "mongoose";
import Module from "./module.model.ts";

describe("Module API Endpoints", () => {
  let testModuleId: string;

  beforeAll(async () => {
    // Ensure database connection before tests
    await mongoose.connect(
      "mongodb://admin:Clfa4ace7d+++.msoft@202.51.83.89:27017/travel?authSource=admin"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /** CREATE MODULE */
  it("should create a new module", async () => {
    const res = await request(app).post("/s-admin/module").send({
      name: "Advanced Analytics 2",
      description: "AI-powered insights",
      moduleType: "premium",
      price: 49.99,
      pricingType: "monthly",
      isActive: true,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    testModuleId = res.body.data._id;
  });
  /**  CREATE MODULE (Missing Required Fields) */
  it("should fail to create a module with missing fields", async () => {
    const res = await request(app).post("/s-admin/module").send({
      name: "", // Missing required fields
      type: "premium",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Validation Error/i);
  });

  /** GET ALL MODULES */
  it("should fetch all modules", async () => {
    const res = await request(app).get("/s-admin/module");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /** GET SINGLE MODULE */
  it("should fetch a single module by ID", async () => {
    const res = await request(app).get(`/s-admin/module/${testModuleId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", testModuleId);
  });

  /**  GET NON-EXISTENT MODULE */
  it("should return 404 for a non-existent module", async () => {
    const res = await request(app).get(
      `/s-admin/module/655555555555555555555555`
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  /** UPDATE MODULE */
  it("should update a module", async () => {
    const res = await request(app).put(`/s-admin/module/${testModuleId}`).send({
      name: "Updated Analytics Module",
      price: 59.99,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Analytics Module");
    expect(res.body.data.price).toBe(59.99);
  });

  /**  UPDATE NON-EXISTENT MODULE */
  it("should return 404 for updating a non-existent module", async () => {
    const res = await request(app)
      .put(`/s-admin/module/655555555555555555555555`)
      .send({
        name: "Non-Existent Module",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  /** DELETE MODULE */
  it("should delete a module", async () => {
    const res = await request(app).delete(`/s-admin/module/${testModuleId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  /** DELETE NON-EXISTENT MODULE */
  it("should return 404 for deleting a non-existent module", async () => {
    const res = await request(app).delete(`/s-admin/module/${testModuleId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });
});
