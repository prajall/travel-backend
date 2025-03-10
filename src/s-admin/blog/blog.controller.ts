import { Request, Response } from "express";
import mongoose from "mongoose";
import Blog from "./blog.model.ts";
import { apiResponse, apiError } from "../../utils/response.util.ts";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subtitle,
      content,
      featuredImage,
      category,
      parentCategory,
      author,
      status,
    } = req.body;

    const user = req.user;

    let { slug } = req.body;

    let existingSlug = await Blog.findOne({ slug });

    if (existingSlug) {
      slug += `-${Date.now()}`; // Append timestamp if slug is not unique
    }

    const newBlog = await Blog.create({
      title,
      subtitle,
      content,
      featuredImage,
      category,
      parentCategory,
      author: user._id,
      status,
      slug,
    });

    return apiResponse(res, 201, "Blog created successfully", newBlog);
  } catch (error) {
    return apiError(res, 500, "Error creating blog", error);
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { category, status, author, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (author) query.author = author;

    const blogs = await Blog.find(query)
      .populate("category", "name")
      .populate("parentCategory", "name")
      .populate("author", "name email")
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    return apiResponse(res, 200, "Blogs fetched successfully", blogs);
  } catch (error) {
    return apiError(res, 500, "Error fetching blogs", error);
  }
};

export const getBlogByIdOrSlug = async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    const query = mongoose.isValidObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const blog = await Blog.findOne(query)
      .populate("category", "name")
      .populate("parentCategory", "name")
      .populate("author", "name email");

    if (!blog) return apiError(res, 404, "Blog not found");

    return apiResponse(res, 200, "Blog fetched successfully", blog);
  } catch (error) {
    return apiError(res, 500, "Error fetching blog", error);
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      content,
      featuredImage,
      category,
      parentCategory,
      status,
    } = req.body;

    const user = req.user;

    let { slug } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return apiError(res, 404, "Blog not found");

    // Generate new slug if title changes
    if (title && title !== blog.title) {
      const existingSlug = await Blog.findOne({ slug });
      if (existingSlug) slug += `-${Date.now()}`;
      blog.slug = slug;
    }

    blog.title = title || blog.title;
    blog.subtitle = subtitle || blog.subtitle;
    blog.content = content || blog.content;
    blog.featuredImage = featuredImage || blog.featuredImage;
    blog.category = category || blog.category;
    blog.parentCategory = parentCategory || blog.parentCategory;
    blog.status = status || blog.status;

    await blog.save();
    return apiResponse(res, 200, "Blog updated successfully", blog);
  } catch (error) {
    return apiError(res, 500, "Error updating blog", error);
  }
};

/**
 * 🔥 Delete a Blog
 */
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) return apiError(res, 404, "Blog not found");

    return apiResponse(res, 200, "Blog deleted successfully");
  } catch (error) {
    return apiError(res, 500, "Error deleting blog", error);
  }
};
