import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript
export interface ICompany extends Document {
  name: string;
  adminEmail: string;
  adminPassword: string;
  modulesEnabled: string[];
  plan: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const CompanySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    modulesEnabled: {
      type: [],
      default: [],
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create Mongoose Model
const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
