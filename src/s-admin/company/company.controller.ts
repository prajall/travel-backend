import { Request, Response } from "express";
import Company from "./company.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, password, modulesEnabled, plan, duration } = req.body;
    const company = await Company.create({
      name,
      email,
      password,
      modulesEnabled,
      plan,
      duration,
    });
    return apiResponse(res, 201, "Company created successfully", company);
  } catch (error) {
    return apiError(res, 500, "Error creating company", error);
  }
};

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.find().populate("plan");
    return apiResponse(res, 200, "Companies retrieved successfully", companies);
  } catch (error) {
    return apiError(res, 500, "Error fetching companies", error);
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id).populate("plan");
    if (!company) {
      return apiError(res, 404, "Company not found");
    }
    return apiResponse(res, 200, "Company retrieved successfully", company);
  } catch (error) {
    return apiError(res, 500, "Error fetching company", error);
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!company) {
      return apiError(res, 404, "Company not found");
    }
    return apiResponse(res, 200, "Company updated successfully", company);
  } catch (error) {
    return apiError(res, 500, "Error updating company", error);
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return apiError(res, 404, "Company not found");
    }
    return apiResponse(res, 200, "Company deleted successfully");
  } catch (error) {
    return apiError(res, 500, "Error deleting company", error);
  }
};
