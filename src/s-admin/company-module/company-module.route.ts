import express from "express";
import {
  createCompanyModule,
  getAllCompanyModules,
  getCompanyModuleById,
  updateCompanyModule,
  deleteCompanyModule,
} from "./company-module.controller.ts";
import { handleValidation } from "../../middlewares/validation.middleware.ts";
import {
  validateCreateCompanyModule,
  validateUpdateCompanyModule,
} from "./company-module.validation.ts";

const router = express.Router();

router.post(
  "/",
  validateCreateCompanyModule,
  handleValidation,
  createCompanyModule
);

router.get("/", getAllCompanyModules);

router.get("/:id", getCompanyModuleById);

router.put(
  "/:id",
  validateUpdateCompanyModule,
  handleValidation,
  updateCompanyModule
);

router.delete("/:id", deleteCompanyModule);

export default router;
