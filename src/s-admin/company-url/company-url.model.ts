import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyUrl extends Document {
  company: mongoose.Types.ObjectId;
  slug: string;
  subDomain: string;
  isCustomDomainEnabled: boolean;
  customDomain?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyUrlSchema: Schema = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    subDomain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isCustomDomainEnabled: {
      type: Boolean,
      default: false,
    },
    customDomain: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

const CompanyUrl = mongoose.model<ICompanyUrl>("CompanyUrl", CompanyUrlSchema);
export default CompanyUrl;
