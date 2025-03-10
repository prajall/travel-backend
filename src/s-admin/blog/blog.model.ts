import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  subtitle?: string;
  content: string;
  featuredImage?: string;
  category: mongoose.Types.ObjectId;
  parentCategory?: mongoose.Types.ObjectId;
  tags: string[];
  author: mongoose.Types.ObjectId;
  status: "draft" | "published" | "archived";
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String, trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: { type: String, unique: true },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;
