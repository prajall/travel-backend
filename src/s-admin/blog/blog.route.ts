import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog,
} from "./blog.controller.ts";
import {
  validateCreateBlog,
  validateUpdateBlog,
  validateBlogId,
  validateBlogQueryParams,
} from "./blog.validation.ts";
import { handleValidation } from "../../middlewares/validation.middleware.ts";
import { authValidation } from "../../middlewares/auth.middleware.ts";

const router = express.Router();

router.post(
  "/",
  authValidation,
  validateCreateBlog,
  handleValidation,
  createBlog
);
router.get("/", validateBlogQueryParams, handleValidation, getAllBlogs);
router.get("/:idOrSlug", validateBlogId, handleValidation, getBlogByIdOrSlug);
router.put(
  "/:id",
  authValidation,
  validateUpdateBlog,
  handleValidation,
  updateBlog
);
router.delete(
  "/:id",
  authValidation,
  validateBlogId,
  handleValidation,
  deleteBlog
);

export default router;
