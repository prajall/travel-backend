import { Request, Response } from "express";
import mongoose from "mongoose";
import CompanyPlan from "./company-plan.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";

/** ✅ CREATE A NEW COMPANY PLAN */
export const createCompanyPlan = async (req: Request, res: Response) => {
  try {
    const {
      companyId,
      planId,
      startDate,
      endDate,
      duration,
      pricingType,
      autoRenew,
      status,
      paymentStatus,
      lastPaymentId,
    } = req.body;

    // Create new company subscription plan
    const newPlan = await CompanyPlan.create({
      companyId,
      planId,
      startDate,
      endDate,
      duration,
      pricingType,
      autoRenew,
      status,
      paymentStatus,
      lastPaymentId,
    });

    return apiResponse(res, 201, "Company plan created successfully", newPlan);
  } catch (error) {
    return apiError(res, 500, "Error creating company plan", error);
  }
};

/** ✅ GET ALL COMPANY PLANS */
export const getAllCompanyPlans = async (req: Request, res: Response) => {
  try {
    const plans = await CompanyPlan.find().populate("companyId planId");

    return apiResponse(res, 200, "Company plans retrieved successfully", plans);
  } catch (error) {
    return apiError(res, 500, "Error fetching company plans", error);
  }
};

/** ✅ GET COMPANY PLAN BY ID */
export const getCompanyPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(res, 400, "Invalid company plan ID format");
    }

    const plan = await CompanyPlan.findById(id).populate("companyId planId");

    if (!plan) return apiError(res, 404, "Company plan not found");

    return apiResponse(res, 200, "Company plan retrieved successfully", plan);
  } catch (error) {
    return apiError(res, 500, "Error fetching company plan", error);
  }
};

/** ✅ UPDATE COMPANY PLAN */
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

/** ✅ DELETE COMPANY PLAN */
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
