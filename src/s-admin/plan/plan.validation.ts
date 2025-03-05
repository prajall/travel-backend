import { body } from "express-validator";

export const validatePlan = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("subTitle")
    .optional()
    .isString()
    .withMessage("Subtitle must be a string"),

  body("modules.*").isString().withMessage("Each module must be a string"),

  body("pricingType")
    .notEmpty()
    .withMessage("Pricing type is required")
    .isIn(["yearly", "monthly", "lifetime", "custom"])
    .withMessage(
      "Invalid pricing type, must be one of 'yearly', 'monthly', 'lifetime', or 'custom'"
    ),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),

  body("isFreeTrialEnabled")
    .optional()
    .isBoolean()
    .withMessage("isFreeTrialEnabled must be a boolean"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
