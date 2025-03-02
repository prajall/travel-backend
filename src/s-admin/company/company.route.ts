import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "./company.controller.ts";
import { companyValidation } from "./company.validation.ts";
import { handleValidation } from "../../middlewares/validation.middleware.ts";

const router = express.Router();

router.post("/", companyValidation, handleValidation, createCompany);
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.put("/:id", companyValidation, handleValidation, updateCompany);
router.delete("/:id", deleteCompany);

export default router;
