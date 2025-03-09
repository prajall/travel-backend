import { Request, Response } from "express";
import CompanyModule from "./company-module.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";
import mongoose from "mongoose";
import ModuleBilling from "../billing/moduleBilling/moduleBilling.model.ts";

export const createCompanyModule = async (req: Request, res: Response) => {
  try {
    const {
      company,
      module,
      startDate = new Date(),
      duration,
      paidAmount,
      currency,
      paymentMethod,
      transactionId,
      invoiceUrl,
    } = req.body;

    // Check if the company already has an active subscription to this module
    const existingCompanyModule = await CompanyModule.findOne({
      company,
      module,
      status: "active",
    });

    if (existingCompanyModule) {
      return apiError(res, 400, "Company is already subscribed to this module");
    }

    console.log("Body:", req.body);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Create Billing Entry for the Module
      const [newBilling] = await ModuleBilling.create(
        {
          company,
          module,
          amount: paidAmount,
          currency,
          paymentMethod,
          transactionId,
          invoiceUrl,
          status: "paid",
        },
        { session }
      );

      console.log("New Billing Created", newBilling);

      if (!newBilling) {
        return apiError(res, 500, "Failed to create Billing");
      }

      // Calculate End Date
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration);

      const newCompanyModule = await CompanyModule.create(
        {
          company,
          module,
          startDate,
          endDate,
          duration,
          status: newBilling.status == "paid" ? "active" : "inactive",
        },
        { session }
      );

      console.log("New Company Module Created", newCompanyModule);

      if (!newCompanyModule) {
        return apiError(res, 500, "Failed to create Company Module");
      }

      await session.commitTransaction();
      session.endSession();

      return apiResponse(
        res,
        201,
        "Company module created successfully",
        newCompanyModule
      );
    } catch (err) {
      console.error("Error Creating Company Module", err);
      await session.abortTransaction();
      session.endSession();
      return apiError(res, 500, "Error creating company module", err);
    }
  } catch (error) {
    return apiError(res, 500, "Error creating company module", error);
  }
};

export const getAllCompanyModules = async (req: Request, res: Response) => {
  const { company, module } = req.query;

  let filter: { company?: string; module?: string } = {};
  if (company) {
    filter.company = company.toString();
  }
  if (module) {
    filter.module = module.toString();
  }
  try {
    const companyModules = await CompanyModule.find(filter).populate(
      "company module"
    );
    return apiResponse(
      res,
      200,
      "Company modules fetched successfully",
      companyModules
    );
  } catch (error) {
    return apiError(res, 500, "Error fetching company modules", error);
  }
};

export const getCompanyModuleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return apiError(res, 400, "Invalid company module ID");

    const companyModule = await CompanyModule.findById(id).populate(
      "company module"
    );
    if (!companyModule) return apiError(res, 404, "Company module not found");

    return apiResponse(
      res,
      200,
      "Company module fetched successfully",
      companyModule
    );
  } catch (error) {
    return apiError(res, 500, "Error fetching company module", error);
  }
};

export const updateCompanyModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return apiError(res, 400, "Invalid company module ID");

    const updatedCompanyModule = await CompanyModule.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCompanyModule)
      return apiError(res, 404, "Company module not found");

    return apiResponse(
      res,
      200,
      "Company module updated successfully",
      updatedCompanyModule
    );
  } catch (error) {
    return apiError(res, 500, "Error updating company module", error);
  }
};

export const deleteCompanyModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return apiError(res, 400, "Invalid company module ID");

    const deletedCompanyModule = await CompanyModule.findByIdAndDelete(id);
    if (!deletedCompanyModule)
      return apiError(res, 404, "Company module not found");

    return apiResponse(res, 200, "Company module deleted successfully");
  } catch (error) {
    return apiError(res, 500, "Error deleting company module", error);
  }
};
