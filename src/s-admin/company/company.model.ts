import mongoose, { Schema, Document } from "mongoose";

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
    },
    // modulesEnabled: {
    //   type: [],
    //   default: [],
    // },
    // plan: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Plan",
    // },
    // duration: {
    //   type: Number,
    //   default: 0,
    // },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;

// Interface for TypeScript
export interface ICompany extends Document {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  adminEmail: string;
  adminPassword: string;
  modulesEnabled: string[];
  plan: string;
  createdAt: Date;
  updatedAt: Date;
}
