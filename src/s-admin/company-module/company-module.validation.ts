import { body, param } from "express-validator";

export const validateCreateCompanyModule = [
  body("company")
    .notEmpty()
    .withMessage("Company ID is required")
    .isMongoId()
    .withMessage("Invalid company ID format"),
  body("module")
    .notEmpty()
    .withMessage("Module ID is required")
    .isMongoId()
    .withMessage("Invalid module ID format"),
  body("startDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid start date format"),
  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),
  body("paidAmount")
    .notEmpty()
    .withMessage("Paid amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Paid amount must be a positive number"),
  body("transactionId")
    .notEmpty()
    .withMessage("Transaction ID is required")
    .isString()
    .withMessage("Transaction ID must be a string"),
];

export const validateUpdateCompanyModule = [
  body("company")
    .optional()
    .isMongoId()
    .withMessage("Invalid company ID format"),
  body("module").optional().isMongoId().withMessage("Invalid module ID format"),
  body("startDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid start date format"),
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),
  body("paidAmount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Paid amount must be a positive number"),
  body("transactionId")
    .optional()
    .isString()
    .withMessage("Transaction ID must be a string"),
];
