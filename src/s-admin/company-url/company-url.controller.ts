import { Request, Response } from "express";
import mongoose from "mongoose";
import CompanyUrl from "./company-url.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";

export const createCompanyUrl = async (req: Request, res: Response) => {
  try {
    const { company, slug, subDomain, isCustomDomainEnabled, customDomain } =
      req.body;

    try {
      // Check if slug is already taken
      const duplicateEntry = await CompanyUrl.findOne({
        $or: [{ slug }, { subDomain }, { customDomain }],
      });

      if (duplicateEntry) {
        if (duplicateEntry.slug === slug) {
          return apiError(res, 400, "Slug is already in use.");
        }
        if (duplicateEntry.subDomain === subDomain) {
          return apiError(res, 400, "Subdomain is already in use.");
        }
        if (duplicateEntry.customDomain === customDomain) {
          return apiError(res, 400, "Custom domain is already in use.");
        }
      }

      // Create new Company URL
      const newCompanyUrl = await CompanyUrl.create({
        company,
        slug,
        subDomain,
        isCustomDomainEnabled,
        customDomain: isCustomDomainEnabled ? customDomain : null,
      });

      return apiResponse(
        res,
        201,
        "Company URL created successfully",
        newCompanyUrl
      );
    } catch (error) {
      return apiError(res, 500, "Error creating company URL", error);
    }
  } catch (error) {
    return apiError(res, 500, "Error creating company URL", error);
  }
};

export const getAllCompanyUrls = async (req: Request, res: Response) => {
  try {
    const companyUrls = await CompanyUrl.find().populate("company");
    return apiResponse(
      res,
      200,
      "Company URLs fetched successfully",
      companyUrls
    );
  } catch (error) {
    return apiError(res, 500, "Error fetching company URLs", error);
  }
};

export const getCompanyUrlById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return apiError(res, 400, "Invalid company URL ID");

    const companyUrl = await CompanyUrl.findById(id).populate("company");
    if (!companyUrl) return apiError(res, 404, "Company URL not found");

    return apiResponse(
      res,
      200,
      "Company URL fetched successfully",
      companyUrl
    );
  } catch (error) {
    return apiError(res, 500, "Error fetching company URL", error);
  }
};

export const updateCompanyUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { slug, subDomain, isCustomDomainEnabled, customDomain } = req.body;

    if (!mongoose.isValidObjectId(id))
      return apiError(res, 400, "Invalid company URL ID");

    try {
      const existingCompanyUrl = await CompanyUrl.findById(id);
      if (!existingCompanyUrl) {
        return apiError(res, 404, "Company URL not found");
      }

      // Check if slug is already taken
      if (slug && slug !== existingCompanyUrl.slug) {
        const existingSlug = await CompanyUrl.findOne({ slug });
        if (existingSlug) return apiError(res, 400, "Slug is already in use.");
      }

      // Check if subDomain is already taken
      if (subDomain && subDomain !== existingCompanyUrl.subDomain) {
        const existingSubDomain = await CompanyUrl.findOne({
          subDomain,
        });
        if (existingSubDomain)
          return apiError(res, 400, "Subdomain is already in use.");
      }

      // Check if customDomain is already taken (if provided)
      if (
        isCustomDomainEnabled &&
        customDomain &&
        customDomain !== existingCompanyUrl.customDomain
      ) {
        const existingCustomDomain = await CompanyUrl.findOne({
          customDomain,
        });
        if (existingCustomDomain)
          return apiError(res, 400, "Custom domain is already in use.");
      }

      existingCompanyUrl.slug = slug || existingCompanyUrl.slug;
      existingCompanyUrl.subDomain = subDomain || existingCompanyUrl.subDomain;
      existingCompanyUrl.isCustomDomainEnabled =
        isCustomDomainEnabled ?? existingCompanyUrl.isCustomDomainEnabled;
      existingCompanyUrl.customDomain = isCustomDomainEnabled
        ? customDomain
        : null;

      await existingCompanyUrl.save();

      return apiResponse(
        res,
        200,
        "Company URL updated successfully",
        existingCompanyUrl
      );
    } catch (error) {
      console.log("Error updating company URl:", error);
      return apiError(res, 500, "Error updating company URL", error);
    }
  } catch (error) {
    return apiError(res, 500, "Error updating company URL", error);
  }
};

export const deleteCompanyUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return apiError(res, 400, "Invalid company URL ID");

    const deletedCompanyUrl = await CompanyUrl.findByIdAndDelete(id);
    if (!deletedCompanyUrl) return apiError(res, 404, "Company URL not found");

    return apiResponse(res, 200, "Company URL deleted successfully");
  } catch (error) {
    return apiError(res, 500, "Error deleting company URL", error);
  }
};
