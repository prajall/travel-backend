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
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive number"),

  body("pricingType")
    .notEmpty()
    .withMessage("Pricing type is required")
    .isIn(["yearly", "monthly", "lifetime"])
    .withMessage(
      "Invalid pricing type, must be 'yearly', 'monthly', or 'lifetime'"
    ),

  body("autoRenew")
    .optional()
    .isBoolean()
    .withMessage("Auto-renew must be a boolean"),

  body("status")
    .optional()
    .isIn(["active", "expired", "canceled"])
    .withMessage("Invalid status, must be 'active', 'expired', or 'canceled'"),

  body("paymentStatus")
    .optional()
    .isIn(["paid", "pending", "failed"])
    .withMessage(
      "Invalid payment status, must be 'paid', 'pending', or 'failed'"
    ),

  body("lastPaymentId")
    .optional()
    .isString()
    .withMessage("Last payment ID must be a string"),
];
