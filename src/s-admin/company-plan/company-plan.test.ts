import request from "supertest";
import app from "../../app.ts";
import mongoose from "mongoose";
import Company from "../company/company.model.ts";
import Plan, { IPlan } from "../plan/plan.model.ts";
import PlanBilling from "../billing/planBilling/planBilling.model.ts";
import CompanyPlan from "./company-plan.model.ts";

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
    email: "company7@example.com",
  });
  companyId = company._id.toString();

  const plan: IPlan | null = await Plan.create({
    title: "Free Plan",
    subTitle: "Kick start your agency with our basic plan",
    modules: [],
    planType: "monthly",
    price: 1200,
    discount: 10,
    isFreeTrialEnabled: true,
    freeTrialDuration: 14,
    isActive: true,
  });
  planId = plan._id.toString();

  console.log("Company & Plan Created", company, plan);
});

/** ❌ Cleanup After Tests */
afterAll(async () => {
  await mongoose.disconnect();
});

describe("POST /s-admin/company-plan", () => {
  it("should create a new company plan with billing", async () => {
    const res = await request(app).post("/s-admin/company-plan").send({
      company: companyId,
      plan: planId,
      autoRenew: true,
      paidAmount: 1000.0,
      status: "active",
      currency: "USD",
      paymentMethod: "esewa",
      transactionId: "txn_1234567890",
      invoiceUrl: "https://example.com/invoice/123456",
    });

    console.log(res.body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.company.toString()).toBe(companyId);
    expect(res.body.data.plan.toString()).toBe(planId);
    expect(res.body.data.autoRenew).toBe(true);
    expect(res.body.data.status).toBe("active");

    companyPlanId = res.body.data._id;
  });

  it("should return validation error for missing required fields", async () => {
    const res = await request(app).post("/s-admin/company-plan").send({
      company: companyId,
      paidAmount: 1000,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return an error when a company already has an active plan", async () => {
    const res = await request(app).post("/s-admin/company-plan").send({
      company: companyId,
      plan: planId,
      autoRenew: true,
      paidAmount: 1000.0,
      currency: "USD",
      status: "active",

      paymentMethod: "esewa",
      transactionId: "txn_duplicate",
      invoiceUrl: "https://example.com/invoice/duplicate",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Company is already subscribed to a plan");
  });
});

// /** ✅ Test Case: Get All Company Plans */
describe("GET /s-admin/company-plan", () => {
  it("should retrieve all company plans", async () => {
    const res = await request(app).get("/s-admin/company-plan");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    // expect(res.body.data.length).toBeGreaterThan(0);
  });
});

// /** ✅ Test Case: Get Company Plan by ID */
describe("GET /s-admin/company-plan/:id", () => {
  it("should retrieve a specific company plan", async () => {
    const res = await request(app).get(
      `/s-admin/company-plan/${companyPlanId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(companyPlanId);
    expect(res.body.data.company._id.toString()).toBe(companyId);
  });

  it("should return 404 for a non-existing plan", async () => {
    const res = await request(app).get(
      `/s-admin/company-plan/65d123456789abcdef012345`
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Company plan not found");
  });
});

// /** ✅ Test Case: Update a Company Plan */
describe("PUT /s-admin/company-plan/:id", () => {
  it("should update the autoRenew field of an existing company plan", async () => {
    const res = await request(app)
      .put(`/s-admin/company-plan/${companyPlanId}`)
      .send({ autoRenew: false });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.autoRenew).toBe(false);
  });

  it("should return 404 for updating a non-existing plan", async () => {
    const res = await request(app)
      .put(`/s-admin/company-plan/65d123456789abcdef012345`)
      .send({ autoRenew: true });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Company plan not found");
  });
});

// /** ✅ Test Case: Delete a Company Plan */
describe("DELETE /s-admin/company-plan/:id", () => {
  it("should delete an existing company plan", async () => {
    const res = await request(app).delete(
      `/s-admin/company-plan/${companyPlanId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Company plan deleted successfully");
  });

  it("should return 404 for deleting a non-existing plan", async () => {
    const res = await request(app).delete(
      `/s-admin/company-plan/65d123456789abcdef012345`
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Company plan not found");
  });
});
