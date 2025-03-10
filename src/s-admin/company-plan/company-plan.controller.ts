import { Request, Response } from "express";
import mongoose from "mongoose";
import CompanyPlan from "./company-plan.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";
import PlanBilling, {
  IPlanBilling,
} from "../billing/planBilling/planBilling.model.ts";
import Plan, { IPlan } from "../plan/plan.model.ts";
import { calcPlanTime } from "./company-plan.function.ts";
import CompanyModule from "../company-module/company-module.model.ts";

export const createCompanyPlan = async (req: Request, res: Response) => {
  try {
    const {
      company,
      plan,
      startDate = new Date(),
      autoRenew,
      status,
      paidAmount,
      currency,
      paymentMethod,
      transactionId,
      invoiceUrl,
    } = req.body;

    // if company is already subscribed then return error
    const existingPlan = await CompanyPlan.findOne({
      company,
      plan,
      status: "active",
    });

    if (existingPlan) {
      return apiError(res, 400, "Company is already subscribed to a plan");
    }

    console.log("Body:", req.body);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const planDoc: IPlan | null = await Plan.findById(plan);

      if (!planDoc) {
        return apiError(res, 404, "Plan not found");
      }

      const newBilling = await PlanBilling.create(
        {
          company,
          plan,
          modules: planDoc.modules,
          amount: paidAmount,
          currency,
          paymentMethod,
          transactionId: transactionId,
          invoiceUrl: invoiceUrl,
          status: "paid",
        }
        // { session }
      );

      console.log("New Billing Created", newBilling);

      if (!newBilling) {
        return apiError(res, 500, "Failed to create Billing");
      }

      const { duration, endDate } = calcPlanTime(planDoc, startDate, false);

      const newCompanyPlan = await CompanyPlan.create(
        {
          company,
          plan,
          startDate,
          duration,
          endDate,
          autoRenew,
          status: newBilling.status == "paid" ? "active" : "inactive",
          billingId: newBilling._id,
        }
        // { session }
      );

      console.log("New Company Plan Created", newCompanyPlan);

      if (!newCompanyPlan) {
        return apiError(res, 500, "Failed to create Company Plan");
      }

      const mockCompanyModules = planDoc.modules.map((module) => ({
        company: company,
        module: module,
        startDate,
        endDate,
        duration,
        status: newCompanyPlan.status,
      }));

      const newCompanyModules = await CompanyModule.insertMany(
        mockCompanyModules
        // { session }
      );

      console.log("New Company Modules Created", newCompanyModules);

      await session.commitTransaction();
      session.endSession();
      return apiResponse(
        res,
        201,
        "Company plan created successfully",
        newCompanyPlan
      );
    } catch (err) {
      console.error("Error Creating Company Plan");
      session.abortTransaction();
      session.endSession();
      return apiError(res, 500, "Error creating company plan", err);
    }
  } catch (error) {
    return apiError(res, 500, "Error creating company plan", error);
  }
};

export const createCompanyFreeTrial = async (req: Request, res: Response) => {
  try {
    const { company, plan, startDate = new Date() } = req.body;

    // if company is already subscribed then return error
    const existingPlan = await CompanyPlan.findOne({
      company,
      plan,
      status: "active",
    });

    if (existingPlan) {
      return apiError(res, 400, "Company is already subscribed to a plan");
    }

    const freePlanUsed = await CompanyPlan.findOne({
      company,
      plan,
      freetrial: true,
    });

    if (freePlanUsed) {
      return apiError(res, 400, "Company has already used the free trial");
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const planDoc: IPlan | null = await Plan.findById(plan);

      if (!planDoc) {
        return apiError(res, 404, "Plan not found");
      }

      const { duration, endDate } = calcPlanTime(planDoc, startDate, true);

      const [newCompanyPlan] = await CompanyPlan.create(
        {
          company,
          plan,
          startDate,
          duration,
          endDate,
          status: "active",
          isFreeTrial: true,
        },
        { session }
      );

      console.log("New Company Plan Created", newCompanyPlan);

      if (!newCompanyPlan) {
        return apiError(res, 500, "Failed to create Company Plan");
      }

      const mockCompanyModules = planDoc.modules.map((module) => ({
        company: company,
        module: module,
        startDate,
        endDate,
        duration,
        status: newCompanyPlan.status,
      }));

      const newCompanyModules = await CompanyModule.insertMany(
        mockCompanyModules,
        { session }
      );

      console.log("New Company Modules Created", newCompanyModules);

      await session.commitTransaction();
      session.endSession();

      return apiResponse(
        res,
        201,
        "Company plan created successfully",
        newCompanyPlan
      );
    } catch (err) {
      console.error("Error Creating Company Plan");
      session.abortTransaction();
      session.endSession();
      return apiError(res, 500, "Error creating company plan", err);
    }
  } catch (error) {
    return apiError(res, 500, "Error creating company plan", error);
  }
};

export const getAllCompanyPlans = async (req: Request, res: Response) => {
  try {
    const plans = await CompanyPlan.find().populate("company plan");

    return apiResponse(res, 200, "Company plans retrieved successfully", plans);
  } catch (error) {
    return apiError(res, 500, "Error fetching company plans", error);
  }
};

export const getCompanyPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(res, 400, "Invalid company plan ID format");
    }

    const plan = await CompanyPlan.findById(id).populate("company plan");

    if (!plan) return apiError(res, 404, "Company plan not found");

    return apiResponse(res, 200, "Company plan retrieved successfully", plan);
  } catch (error) {
    return apiError(res, 500, "Error fetching company plan", error);
  }
};

export const updateCompanyPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(res, 400, "Invalid company plan ID format");
    }

    const updatedPlan = await CompanyPlan.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedPlan) return apiError(res, 404, "Company plan not found");

    return apiResponse(
      res,
      200,
      "Company plan updated successfully",
      updatedPlan
    );
  } catch (error) {
    return apiError(res, 500, "Error updating company plan", error);
  }
};

export const deleteCompanyPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(res, 400, "Invalid company plan ID format");
    }

    const deletedPlan = await CompanyPlan.findByIdAndDelete(id);

    if (!deletedPlan) return apiError(res, 404, "Company plan not found");

    return apiResponse(res, 200, "Company plan deleted successfully");
  } catch (error) {
    return apiError(res, 500, "Error deleting company plan", error);
  }
};
