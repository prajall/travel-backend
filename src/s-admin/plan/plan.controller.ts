import { Request, Response } from "express";
import Plan from "./plan.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";

export const createPlan = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subTitle,
      modules,
      planType,
      price,
      discount = 0,
      isFreeTrialEnabled = false,
      freeTrialDuration,
      isActive = true,
    } = req.body;

    const plan = await Plan.create({
      title,
      subTitle,
      modules,
      planType,
      price,
      discount,
      isFreeTrialEnabled,
      freeTrialDuration,
      isActive,
    });

    return apiResponse(res, 201, "Plan created successfully", plan);
  } catch (error) {
    return apiError(res, 500, "Error creating Plan", error);
  }
};

export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find().populate({
      path: "modules",
      select: "name description moduletype isActive",
    });
    return apiResponse(res, 200, "Plans retrieved successfully", plans);
  } catch (error) {
    return apiError(res, 500, "Error fetching Plans", error);
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return apiError(res, 404, "Plan not found");

    return apiResponse(res, 200, "Plan retrieved successfully", plan);
  } catch (error) {
    return apiError(res, 500, "Error fetching plan", error);
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!plan) return apiError(res, 404, "Plan not found");

    return apiResponse(res, 200, "Plan updated successfully", plan);
  } catch (error) {
    return apiError(res, 500, "Error updating plan", error);
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return apiError(res, 404, "Plan not found");

    return apiResponse(res, 200, "Plan deleted successfully");
  } catch (error) {
    return apiError(res, 500, "Error deleting plan", error);
  }
};
