import express from "express";
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from "./plan.controller.ts";
import { validatePlan } from "./plan.validation.ts";
import { handleValidation } from "../../middlewares/validation.middleware.ts";

const router = express.Router();

router.post("/", validatePlan, handleValidation, createPlan);
router.get("/", getAllPlans);
router.get("/:id", getPlanById);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);

export default router;
