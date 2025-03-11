import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyModule extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  duration: number;
  status: "active" | "expired" | "canceled";
  paymentStatus: "paid" | "pending" | "failed";
}

const CompanyModuleSchema: Schema = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      // required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      // required: true,
    },
    startDate: {
      type: Date,
      // required: true,
    },
    endDate: {
      type: Date,
      // required: true,
    },
    duration: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired", "canceled"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

const CompanyModule = mongoose.model<ICompanyModule>(
  "CompanyModule",
  CompanyModuleSchema
);
export default CompanyModule;
