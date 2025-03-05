import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyPlan extends Document {
  companyId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  duration: number;
  pricingType: "yearly" | "monthly" | "lifetime";
  autoRenew: boolean;
  status: "active" | "expired" | "canceled";
  paymentStatus: "paid" | "pending" | "failed";
  lastPaymentId?: string;
}

const CompanyPlanSchema: Schema = new Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    autoRenew: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["active", "expired", "canceled"],
      default: "active",
    },
    lastPaymentId: { type: String },
  },
  { timestamps: true }
);

const CompanyPlan = mongoose.model<ICompanyPlan>(
  "CompanyPlan",
  CompanyPlanSchema
);
export default CompanyPlan;
