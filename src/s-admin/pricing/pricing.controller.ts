import { Request, Response } from "express";
import Pricing from "./pricing.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";

export const createPricing = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subTitle,
      modules,
      pricingType,
      price,
      discount = 0,
      isFreeTrialEnabled = false,
      freeTrialDuration,
      isActive = true,
    } = req.body;

    const pricing = await Pricing.create({
      title,
      subTitle,
      modules,
      pricingType,
      price,
      discount,
      isFreeTrialEnabled,
      freeTrialDuration,
      isActive,
    });

    return apiResponse(res, 201, "Pricing created successfully", pricing);
  } catch (error) {
    return apiError(res, 500, "Error creating Pricing", error);
  }
};

export const getAllPricings = async (req: Request, res: Response) => {
  try {
    const pricings = await Pricing.find();
    return apiResponse(res, 200, "Pricings retrieved successfully", pricings);
  } catch (error) {
    return apiError(res, 500, "Error fetching Pricings", error);
  }
};

export const getPricingById = async (req: Request, res: Response) => {
  try {
    const pricing = await Pricing.findById(req.params.id);
    if (!pricing) return apiError(res, 404, "Pricing not found");

    return apiResponse(res, 200, "Pricing retrieved successfully", pricing);
  } catch (error) {
    return apiError(res, 500, "Error fetching pricing", error);
  }
};

export const updatePricing = async (req: Request, res: Response) => {
  try {
    const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pricing) return apiError(res, 404, "Pricing not found");

    return apiResponse(res, 200, "Pricing updated successfully", pricing);
  } catch (error) {
    return apiError(res, 500, "Error updating pricing", error);
  }
};

export const deletePricing = async (req: Request, res: Response) => {
  try {
    const pricing = await Pricing.findByIdAndDelete(req.params.id);
    if (!pricing) return apiError(res, 404, "Pricing not found");

    return apiResponse(res, 200, "Pricing deleted successfully");
  } catch (error) {
    return apiError(res, 500, "Error deleting pricing", error);
  }
};
