import { body, param, query } from "express-validator";

/**
 * 🔥 Validation for Creating a Blog Category
 */
export const validateCreateBlogCategory = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name must be a string")
    .trim(),

  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID format"),
];

/**
 * 🔥 Validation for Updating a Blog Category
 */
export const validateUpdateBlogCategory = [
  param("id").isMongoId().withMessage("Invalid category ID"),

  body("name")
    .optional()
    .isString()
    .withMessage("Category name must be a string")
    .trim(),

  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID format"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

/**
 * 🔥 Validation for Category ID in Params
 */
export const validateBlogCategoryId = [
  param("id").isMongoId().withMessage("Invalid category ID"),
];

/**
 * 🔥 Validation for Query Parameters (Filtering & Pagination)
 */
export const validateBlogCategoryQueryParams = [
  query("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID format"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive number"),
];
