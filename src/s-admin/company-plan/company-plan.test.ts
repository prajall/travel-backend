import request from "supertest";
import app from "../../app.ts";
import mongoose from "mongoose";
import Company from "../company/company.model.ts";
import Plan from "../plan/plan.model.ts";

let companyId: string;
let planId: string;
let companyPlanId: string;

/** ✅ Setup Test Database */
beforeAll(async () => {
  await mongoose.connect(
    "mongodb://admin:Clfa4ace7d+++.msoft@202.51.83.89:27017/travel?authSource=admin"
  );

  // Create test company & plan
  const company = await Company.create({
    name: "Test Company",
    email: "company@example.com",
  });
  companyId = company._id.toString();

  const plan = await Plan.create({
    title: "Basic Plan",
    price: 100,
    pricingType: "monthly",
  });
  planId = plan._id.toString();
});

/** ❌ Cleanup After Tests */
afterAll(async () => {
  await mongoose.disconnect();
});

/** ✅ Test Case: Create a Company Plan */
describe("POST /s-admin/company-plans", () => {
  it("should create a new company plan", async () => {
    const res = await request(app).post("/s-admin/company-plans").send({
      company: companyId,
      plan: planId,
      planType: "yearly",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      duration: 365,
      pricingType: "yearly",
      autoRenew: true,
      status: "active",
      paymentStatus: "pending",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.companyId).toBe(companyId);
    companyPlanId = res.body.data._id;
  });

  it("should return validation error for missing fields", async () => {
    const res = await request(app).post("/s-admin/company-plans").send({
      company: companyId,
      startDate: "2025-01-01",
      duration: 365,
      pricingType: "yearly",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

/** ✅ Test Case: Get All Company Plans */
describe("GET /s-admin/company-plans", () => {
  it("should retrieve all company plans", async () => {
    const res = await request(app).get("/s-admin/company-plans");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

/** ✅ Test Case: Get Company Plan by ID */
describe("GET /s-admin/company-plans/:id", () => {
  it("should retrieve a specific company plan", async () => {
    const res = await request(app).get(
      `/s-admin/company-plans/${companyPlanId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(companyPlanId);
  });

  it("should return 404 for non-existing plan", async () => {
    const res = await request(app).get(
      `/s-admin/company-plans/65d123456789abcdef012345`
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

/** ✅ Test Case: Update a Company Plan */
describe("PUT /s-admin/company-plans/:id", () => {
  it("should update an existing company plan", async () => {
    const res = await request(app)
      .put(`/s-admin/company-plans/${companyPlanId}`)
      .send({ autoRenew: false, paymentStatus: "paid" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.autoRenew).toBe(false);
    expect(res.body.data.paymentStatus).toBe("paid");
  });

  it("should return 404 for updating non-existing plan", async () => {
    const res = await request(app)
      .put(`/s-admin/company-plans/65d123456789abcdef012345`)
      .send({ autoRenew: true });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

/** ✅ Test Case: Delete a Company Plan */
describe("DELETE /s-admin/company-plans/:id", () => {
  it("should delete an existing company plan", async () => {
    const res = await request(app).delete(
      `/s-admin/company-plans/${companyPlanId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 for deleting non-existing plan", async () => {
    const res = await request(app).delete(
      `/s-admin/company-plans/65d123456789abcdef012345`
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
