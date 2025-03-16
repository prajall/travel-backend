import request from "supertest";
import app from "../../app.ts";
import mongoose from "mongoose";
import Plan from "./plan.model.ts";

describe("Plan API Endpoints", () => {
  let testPlanId: string;

  beforeAll(async () => {
    await mongoose.connect(
      "mongodb://admin:Clfa4ace7d+++.msoft@202.51.83.89:27017/travel?authSource=admin"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new plan plan", async () => {
    const res = await request(app).post("/s-admin/plan").send({
      title: "Pro Plan 2",
      subTitle: "Advanced features for professionals",
      modules: [],
      planType: "monthly",
      price: 29.99,
      discount: 10,
      isFreeTrialEnabled: true,
      freeTrialDuration: 14,
      isActive: true,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    testPlanId = res.body.data._id;
  });

  it("should fail to create a plan with missing fields", async () => {
    const res = await request(app).post("/s-admin/plan").send({
      title: "",
      planType: "monthly",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Validation Error/i);
  });

  it("should fetch all plan plans", async () => {
    const res = await request(app).get("/s-admin/plan");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /** ✅ GET SINGLE PRICING PLAN */
  it("should fetch a single plan plan by ID", async () => {
    const res = await request(app).get(`/s-admin/plan/${testPlanId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", testPlanId);
  });

  it("should return 404 for a non-existent plan plan", async () => {
    const res = await request(app).get(
      `/s-admin/plan/655555555555555555555555`
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should update a plan plan", async () => {
    const res = await request(app).put(`/s-admin/plan/${testPlanId}`).send({
      title: "Updated Plan",
      price: 39.99,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Updated Plan");
    expect(res.body.data.price).toBe(39.99);
  });

  it("should return 404 for updating a non-existent plan plan", async () => {
    const res = await request(app)
      .put(`/s-admin/plan/655555555555555555555555`)
      .send({
        title: "Non-Existent Plan",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should delete a plan plan", async () => {
    const res = await request(app).delete(`/s-admin/plan/${testPlanId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it("should return 404 for deleting a non-existent plan plan", async () => {
    const res = await request(app).delete(`/s-admin/plan/${testPlanId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });
});
