import express from "express";
import {
  createCompanyUrl,
  getAllCompanyUrls,
  getCompanyUrlById,
  updateCompanyUrl,
  deleteCompanyUrl,
} from "./company-url.controller.ts";
import { handleValidation } from "../../middlewares/validation.middleware.ts";
import {
  validateCreateCompanyUrl,
  validateUpdateCompanyUrl,
  validateCompanyUrlId,
} from "./company-url.validation.ts";

const router = express.Router();

// 🔥 Create a new company URL
router.post("/", validateCreateCompanyUrl, handleValidation, createCompanyUrl);

// 🔥 Get all company URLs
router.get("/", getAllCompanyUrls);

// 🔥 Get a specific company URL by ID
router.get("/:id", validateCompanyUrlId, handleValidation, getCompanyUrlById);

// 🔥 Update a company URL
router.put(
  "/:id",
  validateUpdateCompanyUrl,
  handleValidation,
  updateCompanyUrl
);

// 🔥 Delete a company URL
router.delete("/:id", validateCompanyUrlId, handleValidation, deleteCompanyUrl);

export default router;
