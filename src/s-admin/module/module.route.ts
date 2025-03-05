import express from "express";
import {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  createMultipleModules,
} from "./module.controller.ts";
import { validateModule } from "./module.validation.ts";
import { handleValidation } from "../../middlewares/validation.middleware.ts";

const router = express.Router();

// ✅ Module CRUD Routes
router.post("/", validateModule, handleValidation, createModule);
router.get("/", getAllModules);
router.get("/:id", getModuleById);
router.put("/:id", updateModule);
router.delete("/:id", deleteModule);

// router.post("/multi", createMultipleModules);

export default router;
