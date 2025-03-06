import mongoose, { Schema, Document } from "mongoose";

export interface IModuleBilling extends Document {
  company: mongoose.Types.ObjectId;
  module: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: "esewa" | "bankTransfer" | "manual";
  transactionId: string;
  status: "pending" | "paid" | "failed";
  invoiceUrl?: string;
  paymentDate: Date;
}

const ModuleBillingSchema: Schema = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: { type: String, default: "RS" },
    paymentMethod: {
      type: String,
      enum: ["esewa", "bankTransfer", "manual"],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
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

const ModuleBilling = mongoose.model<IModuleBilling>(
  "ModuleBilling",
  ModuleBillingSchema
);
export default ModuleBilling;
