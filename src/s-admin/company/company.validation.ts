import { body } from "express-validator";

export const companyValidation = [
  body("name")
    .notEmpty()
    .withMessage("Company name is required")
    .isString()
    .withMessage("Company name must be a string")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("modulesEnabled")
    .optional()
    .isArray()
    .withMessage("Modules should be an array of strings"),

  body("modulesEnabled.*")
    .optional()
    .isString()
    .withMessage("Each module must be a string"),

  body("plan").optional().isMongoId().withMessage("Invalid plan ID format"),

  body("duration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Duration must be a positive integer"),
];
