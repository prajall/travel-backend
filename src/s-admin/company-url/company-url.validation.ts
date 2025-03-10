import { body, param } from "express-validator";

export const validateCreateCompanyUrl = [
  body("company")
    .notEmpty()
    .withMessage("Company ID is required")
    .isMongoId()
    .withMessage("Invalid Company ID format"),

  body("slug")
    .notEmpty()
    .withMessage("Slug is required")
    .isString()
    .withMessage("Slug must be a string"),

  body("subDomain")
    .notEmpty()
    .withMessage("Subdomain is required")
    .isString()
    .withMessage("Subdomain must be a string"),

  body("isCustomDomainEnabled")
    .optional()
    .isBoolean()
    .withMessage("isCustomDomainEnabled must be a boolean"),

  body("customDomain")
    .optional()
    .isString()
    .withMessage("Custom domain must be a string"),
];

export const validateUpdateCompanyUrl = [
  param("id").isMongoId().withMessage("Invalid company URL ID"),

  body("slug").optional().isString().withMessage("Slug must be a string"),

  body("subDomain")
    .optional()
    .isString()
    .withMessage("Subdomain must be a string"),

  body("isCustomDomainEnabled")
    .optional()
    .isBoolean()
    .withMessage("isCustomDomainEnabled must be a boolean"),

  body("customDomain")
    .optional()
    .isString()
    .withMessage("Custom domain must be a string"),
];

export const validateCompanyUrlId = [
  param("id").isMongoId().withMessage("Invalid company URL ID"),
];
