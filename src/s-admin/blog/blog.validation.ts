import { body, param, query } from "express-validator";

export const validateCreateBlog = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim(),

  body("subtitle")
    .optional()
    .isString()
    .withMessage("Subtitle must be a string")
    .trim(),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),

  body("featuredImage")
    .optional()
    .isString()
    .withMessage("Featured image must be a valid URL"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID format"),

  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID format"),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be 'draft', 'published', or 'archived'"),
];

export const validateUpdateBlog = [
  param("id").isMongoId().withMessage("Invalid blog ID"),

  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .trim(),

  body("subtitle")
    .optional()
    .isString()
    .withMessage("Subtitle must be a string")
    .trim(),

  body("content").optional().isString().withMessage("Content must be a string"),

  body("featuredImage")
    .optional()
    .isString()
    .withMessage("Featured image must be a valid URL"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format"),

  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID format"),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be 'draft', 'published', or 'archived'"),
];

export const validateBlogId = [
  param("id").isMongoId().withMessage("Invalid blog ID"),
];

export const validateBlogQueryParams = [
  query("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format"),

  query("author")
    .optional()
    .isMongoId()
    .withMessage("Invalid author ID format"),

  query("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage(
      "Invalid status filter. Allowed values: 'draft', 'published', 'archived'"
    ),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive number"),
];
