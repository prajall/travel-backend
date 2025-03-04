import { body } from "express-validator";

export const validateModule = [
  body("name")
    .notEmpty()
    .withMessage("Module name is required")
    .isString()
    .withMessage("Module name must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("type")
    .notEmpty()
    .withMessage("Module type is required")
    .isIn(["free", "premium"])
    .withMessage("Invalid module type, must be 'free' or 'premium'"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .custom((value, { req }) => {
      if (req.body.type === "premium" && value === undefined) {
        throw new Error("Price is required for premium modules");
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
