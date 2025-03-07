import { Request, Response } from "express";
import mongoose from "mongoose";
import CompanyPlan from "./company-plan.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";
import PlanBilling from "../billing/planBilling/planBilling.model.ts";
import Plan, { IPlan } from "../plan/plan.model.ts";
import { calcPlanTime } from "./company-plan.function.ts";

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

    // if company is already subscribed then reduce the pricing / ask to cancel /

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const planDoc: IPlan | null = await Plan.findById(plan);

      if (!planDoc) {
        return apiError(res, 404, "Plan not found");
      }

      const newBilling = await PlanBilling.create({
        company,
        plan,
        modules: planDoc.modules,
        amount: paidAmount,
        currency,
        paymentMethod,
        transactionId,
        invoiceUrl,
        status: "paid",
      });

      const { duration, endDate } = calcPlanTime(planDoc, startDate);

      const newCompanyPlan = await CompanyPlan.create({
        company,
        plan,
        startDate,
        duration,
        endDate,
        autoRenew,
        status: newBilling.status == "paid" ? "active" : "inactive",
        billingId: newBilling._id,
      });

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
