import { Request, Response } from "express";
import Module from "./module.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";
import mongoose from "mongoose";

export const createModule = async (req: Request, res: Response) => {
  try {
    const { name, description, moduleType, price, pricingType, isActive } =
      req.body;

    const newModule = await Module.create({
      name,
      description,
      moduleType,
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

export const createMultipleModules = async (req: Request, res: Response) => {
  const modules = [
    {
      name: "Notes and Communication",
      description: "Description of module",
      type: "free",
      price: 0,
      isActive: true,
    },
    {
      name: "Destinations",
      description: "Description of module",
      type: "free",
      price: 0,
      isActive: true,
    },
    {
      name: "Itinerary Builder",
      description: "Description of module",
      type: "free",
      price: 0,
      isActive: true,
    },
    {
      name: "Tour Packages",
      description: "Description of module",
      type: "free",
      price: 0,
      isActive: true,
    },
    {
      name: "Lead Management",
      description: "Description of module",
      type: "free",
      price: 0,
      isActive: true,
    },
    {
      name: "Sales Pipeline",
      description: "Description of module",
      type: "free",
      price: 0,
      isActive: true,
    },
    {
      name: "Quotations",
      description: "Description of module",
      type: "free",
      price: 0,
      isActive: true,
    },
    {
      name: "Email and SMS",
      description: "Description of module",
      type: "free",
      price: 0,
      isActive: true,
    },
    {
      name: "Forms",
      description: "Description of module",
      type: "free",
      price: 0,
      isActive: true,
    },
    {
      name: "Booking Management",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Agent Bookings",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Documentation Generation",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Customer Support / Tickets",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Payment Integrations",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "3rd party SMS / Emails / ETC",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Blogs",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Contact",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Pages / Custom Pages",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Hotels",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Rooms",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "Vehicles",
      description: "Description of module",
      type: "premium",
      price: 1000,
      isActive: true,
    },
    {
      name: "AI",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "OTA Integrations",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "Advance Reports",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "Whatsapp Integration",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "Facebook Leads",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "Custom Forms",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "Live Chat",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "Accounting / Payrolls",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "B2B",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "Company Profile",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "Company settings",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
    {
      name: "Documents",
      description: "Description of module",
      type: "addOns",
      price: 1000,
      isActive: true,
    },
  ];
  try {
    const response = await Module.insertMany(modules);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};
