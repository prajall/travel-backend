import mongoose, { Schema, Document } from "mongoose";

export interface IModule extends Document {
  name: string;
  description?: string;
  type: "free" | "premium";
  price?: number;
  isActive: boolean;
}

const ModuleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },

    description: { type: String, trim: true },

    type: {
      type: String,
      enum: ["free", "premium"],
      required: true,
    },

    price: {
      type: Number,
      min: 0,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Module = mongoose.model<IModule>("Module", ModuleSchema);
export default Module;
