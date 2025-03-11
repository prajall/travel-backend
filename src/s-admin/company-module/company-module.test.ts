import request from "supertest";
import app from "../../app.ts";
import mongoose from "mongoose";
import Company from "../company/company.model.ts";
import Module, { IModule } from "../module/module.model.ts";
import CompanyModule from "./company-module.model.ts";
import ModuleBilling from "../billing/moduleBilling/moduleBilling.model.ts";

let companyId: string;
let moduleId: string;
let companyModuleId: string;

/** ✅ Setup Test Database */
beforeAll(async () => {
  await mongoose.connect(
    "mongodb://admin:Clfa4ace7d+++.msoft@202.51.83.89:27017/travel?authSource=admin"
  );

  // Create test company
  const company = await Company.create({
    name: "Test Travel Company",
    email: "company13@example.com",
  });
  companyId = company._id.toString();

  // Create test module
  const module: IModule | null = await Module.create({
    name: "Advanced Reporting 5",
    description: "Generate detailed reports for business insights",
    moduleType: "premium",
    price: 500,
    isActive: true,
  });
  moduleId = module._id?.toString() || "";
});

/** ❌ Cleanup After Tests */
afterAll(async () => {
  await Company.findByIdAndDelete(companyId);
  await Module.findByIdAndDelete(moduleId);
  await mongoose.disconnect();
});

/** ✅ Test Case: Create a Company Module */
describe("POST /s-admin/company-module", () => {
  it("should create a new company module with billing", async () => {
    const res = await request(app).post("/s-admin/company-module").send({
      company: companyId,
      module: moduleId,
      startDate: "2025-03-10T00:00:00.000Z",
      duration: 30,
      paidAmount: 500,
      currency: "USD",
      paymentMethod: "esewa",
      transactionId: "txn_987654321",
      invoiceUrl: "https://example.com/invoice/module",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.company.toString()).toBe(companyId);
    expect(res.body.data.module.toString()).toBe(moduleId);
    expect(res.body.data.status).toBe("active");

    companyModuleId = res.body.data._id;
  });

  it("should return validation error for missing fields", async () => {
    const res = await request(app).post("/s-admin/company-module").send({
      company: companyId,
      startDate: "2025-03-10T00:00:00.000Z",
      duration: 30,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should prevent duplicate active module subscriptions", async () => {
    const res = await request(app).post("/s-admin/company-module").send({
      company: companyId,
      module: moduleId,
      startDate: "2025-03-10T00:00:00.000Z",
      duration: 30,
      paidAmount: 500,
      currency: "USD",
      paymentMethod: "esewa",
      transactionId: "txn_duplicate",
      invoiceUrl: "https://example.com/invoice/duplicate",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "Company is already subscribed to this module"
    );
  });
});

/** ✅ Test Case: Get All Company Modules */
describe("GET /s-admin/company-module", () => {
  it("should retrieve all company modules", async () => {
    const res = await request(app).get("/s-admin/company-module");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

/** ✅ Test Case: Get Company Module by ID */
describe("GET /s-admin/company-module/:id", () => {
  it("should retrieve a specific company module", async () => {
    const res = await request(app).get(
      `/s-admin/company-module/${companyModuleId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(companyModuleId);
    expect(res.body.data.company._id.toString()).toBe(companyId);
  });

  it("should return 404 for a non-existing module", async () => {
    const res = await request(app).get(
      `/s-admin/company-module/65d123456789abcdef012345`
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Company module not found");
  });
});

/** ✅ Test Case: Update a Company Module */
describe("PUT /s-admin/company-module/:id", () => {
  it("should update the status of an existing company module", async () => {
    const res = await request(app)
      .put(`/s-admin/company-module/${companyModuleId}`)
      .send({ status: "expired" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("expired");
  });

  it("should return 404 for updating a non-existing module", async () => {
    const res = await request(app)
      .put(`/s-admin/company-module/65d123456789abcdef012345`)
      .send({ status: "canceled" });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Company module not found");
  });
});

/** ✅ Test Case: Delete a Company Module */
describe("DELETE /s-admin/company-module/:id", () => {
  it("should delete an existing company module", async () => {
    const res = await request(app).delete(
      `/s-admin/company-module/${companyModuleId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Company module deleted successfully");
  });

  it("should return 404 for deleting a non-existing module", async () => {
    const res = await request(app).delete(
      `/s-admin/company-module/65d123456789abcdef012345`
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Company module not found");
  });
});
