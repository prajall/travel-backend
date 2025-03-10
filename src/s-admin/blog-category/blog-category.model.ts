import mongoose, { Schema, Document } from "mongoose";

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  parentCategory?: mongoose.Types.ObjectId | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },

    slug: { type: String, required: true, unique: true },

    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      default: null,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BlogCategory = mongoose.model<IBlogCategory>(
  "BlogCategory",
  BlogCategorySchema
);
export default BlogCategory;
