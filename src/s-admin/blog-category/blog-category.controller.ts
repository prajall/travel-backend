import { Request, Response } from "express";
import mongoose from "mongoose";
import BlogCategory from "./blog-category.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";

export const createBlogCategory = async (req: Request, res: Response) => {
  try {
    const { name, parentCategory } = req.body;
    let { slug } = req.body;

    // Generate unique slug
    const existingSlug = await BlogCategory.findOne({ slug });
    if (existingSlug) {
      slug += `-${Date.now()}`; // Append timestamp if slug is not unique
    }

    const newCategory = await BlogCategory.create({
      name,
      slug,
      parentCategory: parentCategory || null,
    });

    return apiResponse(
      res,
      201,
      "Blog category created successfully",
      newCategory
    );
  } catch (error) {
    return apiError(res, 500, "Error creating blog category", error);
  }
};

export const getAllBlogCategories = async (req: Request, res: Response) => {
  try {
    const { parentCategory } = req.query;
    const query: any = {};

    if (parentCategory) query.parentCategory = parentCategory;

    const categories = await BlogCategory.find(query).populate(
      "parentCategory",
      "name"
    );

    return apiResponse(
      res,
      200,
      "Blog categories fetched successfully",
      categories
    );
  } catch (error) {
    return apiError(res, 500, "Error fetching blog categories", error);
  }
};

export const getBlogCategoryByIdOrSlug = async (
  req: Request,
  res: Response
) => {
  try {
    const { idOrSlug } = req.params;
    const query = mongoose.isValidObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const category = await BlogCategory.findOne(query).populate(
      "parentCategory",
      "name"
    );

    if (!category) return apiError(res, 404, "Blog category not found");

    return apiResponse(
      res,
      200,
      "Blog category fetched successfully",
      category
    );
  } catch (error) {
    return apiError(res, 500, "Error fetching blog category", error);
  }
};

export const updateBlogCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, parentCategory, isActive } = req.body;
    let { slug } = req.body;

    const category = await BlogCategory.findById(id);
    if (!category) return apiError(res, 404, "Blog category not found");

    // Generate new slug if name changes
    if (name && name !== category.name) {
      const existingSlug = await BlogCategory.findOne({ slug });
      if (existingSlug) slug += `-${Date.now()}`;
      category.slug = slug;
    }

    category.name = name || category.name;
    category.parentCategory = parentCategory || category.parentCategory;
    category.isActive = isActive !== undefined ? isActive : category.isActive;

    await category.save();
    return apiResponse(
      res,
      200,
      "Blog category updated successfully",
      category
    );
  } catch (error) {
    return apiError(res, 500, "Error updating blog category", error);
  }
};

/**
 * 🔥 Delete a Blog Category
 */
export const deleteBlogCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await BlogCategory.findByIdAndDelete(id);
    if (!deletedCategory) return apiError(res, 404, "Blog category not found");

    return apiResponse(res, 200, "Blog category deleted successfully");
  } catch (error) {
    return apiError(res, 500, "Error deleting blog category", error);
  }
};
