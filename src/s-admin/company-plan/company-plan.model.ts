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
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    plan: {
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
      enum: ["active", "inactive", "expired", "canceled"],
      default: "inactive",
    },
    billingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanBilling",
    },
  },
  { timestamps: true }
);

const CompanyPlan = mongoose.model<ICompanyPlan>(
  "CompanyPlan",
  CompanyPlanSchema
);
export default CompanyPlan;
