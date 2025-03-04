import request from "supertest";
import app from "../../app.ts";
import mongoose from "mongoose";
import Pricing from "./pricing.model.ts";

describe("Pricing API Endpoints", () => {
  let testPlanId: string;

  beforeAll(async () => {
    await mongoose.connect(
      "mongodb://admin:Clfa4ace7d+++.msoft@202.51.83.89:27017/travel?authSource=admin"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new pricing plan", async () => {
    const res = await request(app)
      .post("/s-admin/pricing")
      .send({
        title: "Pro Plan",
        subTitle: "Advanced features for professionals",
        modules: ["analytics", "email automation"],
        pricingType: "monthly",
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

  it("should fail to create a pricing plan with missing fields", async () => {
    const res = await request(app).post("/s-admin/pricing").send({
      title: "",
      pricingType: "monthly",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Validation Error/i);
  });

  it("should fetch all pricing plans", async () => {
    const res = await request(app).get("/s-admin/pricing");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /** ✅ GET SINGLE PRICING PLAN */
  it("should fetch a single pricing plan by ID", async () => {
    const res = await request(app).get(`/s-admin/pricing/${testPlanId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", testPlanId);
  });

  it("should return 404 for a non-existent pricing plan", async () => {
    const res = await request(app).get(
      `/s-admin/pricing/655555555555555555555555`
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should update a pricing plan", async () => {
    const res = await request(app).put(`/s-admin/pricing/${testPlanId}`).send({
      title: "Updated Plan",
      price: 39.99,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Updated Plan");
    expect(res.body.data.price).toBe(39.99);
  });

  it("should return 404 for updating a non-existent pricing plan", async () => {
    const res = await request(app)
      .put(`/s-admin/pricing/655555555555555555555555`)
      .send({
        title: "Non-Existent Plan",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should delete a pricing plan", async () => {
    const res = await request(app).delete(`/s-admin/pricing/${testPlanId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it("should return 404 for deleting a non-existent pricing plan", async () => {
    const res = await request(app).delete(`/s-admin/pricing/${testPlanId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });
});
