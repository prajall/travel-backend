import express from "express";
import {
  createPricing,
  getAllPricings,
  getPricingById,
  updatePricing,
  deletePricing,
} from "./pricing.controller.ts";
import { validatePricing } from "./pricing.validation.ts";
import { handleValidation } from "../../middlewares/validation.middleware.ts";

const router = express.Router();

router.post("/", validatePricing, handleValidation, createPricing);
router.get("/", getAllPricings);
router.get("/:id", getPricingById);
router.put("/:id", validatePricing, handleValidation, updatePricing);
router.delete("/:id", deletePricing);

export default router;
