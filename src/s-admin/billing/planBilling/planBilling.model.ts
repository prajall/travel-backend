import mongoose, { Schema, Document } from "mongoose";

export interface IPlanBilling extends Document {
  company: mongoose.Types.ObjectId;
  plan: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: "stripe" | "paypal" | "manual";
  transactionId: string;
  status: "pending" | "paid" | "failed";
  invoiceUrl?: string;
  paymentDate: Date;
  nextBillingDate?: Date;
}

const PlanBillingSchema: Schema = new Schema(
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
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    // moduleNames: [
    //   {
    //     type: String,
    //   },
    // ],
    amount: { type: Number, required: true },
    currency: { type: String, default: "RS" },
    paymentMethod: {
      type: String,
      enum: ["esewa", "bankTransfer", "manual"],
      required: true,
    },
    transactionId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    invoiceUrl: { type: String },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PlanBilling = mongoose.model<IPlanBilling>(
  "PlanBilling",
  PlanBillingSchema
);
export default PlanBilling;
