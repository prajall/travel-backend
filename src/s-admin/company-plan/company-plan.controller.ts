import { Request, Response } from "express";
import mongoose from "mongoose";
import CompanyPlan from "./company-plan.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";

export const createCompanyPlan = async (req: Request, res: Response) => {
  try {
    const {
      company,
      plan,
      startDate,
      endDate,
      duration,
      pricingType,
      autoRenew,
      status,
      paymentStatus,
      lastPaymentId,
    } = req.body;

    // if company is already subscribed then reduce the pricing / ask to cancel /

    const newPlan = await CompanyPlan.create({
      company,
      plan,
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
