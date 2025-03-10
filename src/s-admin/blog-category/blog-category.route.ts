import express from "express";
import {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryByIdOrSlug,
  updateBlogCategory,
  deleteBlogCategory,
} from "./blog-category.controller.ts";
import {
  validateCreateBlogCategory,
  validateUpdateBlogCategory,
  validateBlogCategoryId,
  validateBlogCategoryQueryParams,
} from "./blog-category.validation.ts";
import { handleValidation } from "../../middlewares/validation.middleware.ts";
import { authValidation } from "../../middlewares/auth.middleware.ts";

const router = express.Router();

router.post(
  "/",
  authValidation,
  validateCreateBlogCategory,
  handleValidation,
  createBlogCategory
);

router.get(
  "/",
  validateBlogCategoryQueryParams,
  handleValidation,
  getAllBlogCategories
);

router.get(
  "/:idOrSlug",
  validateBlogCategoryId,
  handleValidation,
  getBlogCategoryByIdOrSlug
);

router.put(
  "/:id",
  authValidation,
  validateUpdateBlogCategory,
  handleValidation,
  updateBlogCategory
);

router.delete(
  "/:id",
  authValidation,
  validateBlogCategoryId,
  handleValidation,
  deleteBlogCategory
);

export default router;
