import { Request, Response } from "express";
import Module from "./module.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";
import mongoose from "mongoose";

export const createModule = async (req: Request, res: Response) => {
  try {
    const { name, description, type, price, pricingType, isActive } = req.body;

    const newModule = await Module.create({
      name,
      description,
      type,
      price,
      pricingType,
      isActive,
    });

    return apiResponse(res, 201, "Module created successfully", newModule);
  } catch (error) {
    return apiError(res, 500, "Error creating module", error);
  }
};

export const getAllModules = async (req: Request, res: Response) => {
  try {
    const modules = await Module.find();
    return apiResponse(res, 200, "Modules retrieved successfully", modules);
  } catch (error) {
    return apiError(res, 500, "Error fetching modules", error);
  }
};

export const getModuleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(res, 400, "Invalid module ID format");
    }

    const module = await Module.findById(id);
    if (!module) return apiError(res, 404, "Module not found");

    return apiResponse(res, 200, "Module retrieved successfully", module);
  } catch (error) {
    return apiError(res, 500, "Error fetching module", error);
  }
};

export const updateModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(res, 400, "Invalid module ID format");
    }

    const updatedModule = await Module.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedModule) return apiError(res, 404, "Module not found");

    return apiResponse(res, 200, "Module updated successfully", updatedModule);
  } catch (error) {
    return apiError(res, 500, "Error updating module", error);
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(res, 400, "Invalid module ID format");
    }

    const deletedModule = await Module.findByIdAndDelete(id);
    if (!deletedModule) return apiError(res, 404, "Module not found");

    return apiResponse(res, 200, "Module deleted successfully");
  } catch (error) {
    return apiError(res, 500, "Error deleting module", error);
  }
};
