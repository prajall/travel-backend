import express from "express";
import {
  createCompanyPlan,
  getAllCompanyPlans,
  getCompanyPlanById,
  updateCompanyPlan,
  deleteCompanyPlan,
} from "./company-plan.controller.ts";
import { validateCompanyPlan } from "./company-plan.validation.ts";
import { handleValidation } from "../../middlewares/validation.middleware.ts";

const router = express.Router();

router.post("/", validateCompanyPlan, handleValidation, createCompanyPlan);
router.post("/", createCompanyPlan);
router.get("/", getAllCompanyPlans);
router.get("/:id", getCompanyPlanById);
router.put("/:id", updateCompanyPlan);
router.delete("/:id", deleteCompanyPlan);

export default router;
