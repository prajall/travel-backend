import { body } from "express-validator";

export const validateCompanyPlan = [
  body("company")
    .notEmpty()
    .withMessage("Company ID is required")
    .isMongoId()
    .withMessage("Invalid Company ID format"),

  body("plan")
    .notEmpty()
    .withMessage("Plan ID is required")
    .isMongoId()
    .withMessage("Invalid Plan ID format"),

  body("startDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),

  body("autoRenew")
    .optional()
    .isBoolean()
    .withMessage("Auto-renew must be a boolean"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["active", "inactive"])
    .withMessage("Invalid status, must be 'active' or 'inactive'"),

  body("paidAmount")
    .notEmpty()
    .withMessage("Paid amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Paid amount must be a positive number"),

  body("currency")
    .notEmpty()
    .withMessage("Currency is required")
    .isString()
    .withMessage("Currency must be a string"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["esewa", "bankTransfer", "manual"])
    .withMessage(
      "Invalid payment method, must be 'esewa', 'bankTransfer', or 'manual'"
    ),

  body("transactionId")
    .notEmpty()
    .withMessage("Transaction ID is required")
    .isString()
    .withMessage("Transaction ID must be a string"),
];
