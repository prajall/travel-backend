import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  title: string;
  modules: string[];
  pricingType: "yearly" | "monthly" | "lifetime" | "custom";
  price: number;
  currency: string;
  isFreeTrialEnabled: boolean;
  freeTrialDurationType?: "days" | "weeks" | "months";
  freeTrialDuration?: number;
  isFeatureBasedPricing: boolean;
  featurePricing?: {
    moduleName: string;
    price: number;
  }[];
  maxUsers?: number;
  maxStorage?: number;
  isActive: boolean;
}

const PlanSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },

    subTitle: {
      type: String,
      trim: true,
    },

    modules: {
      type: [String],
      required: true,
    },

    pricingType: {
      type: String,
      enum: ["yearly", "monthly", "lifetime", "custom"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    // currency: {
    //   type: String,
    //   default: "USD",
    // },

    isFreeTrialEnabled: {
      type: Boolean,
      default: false,
    },

    // freeTrialDurationType: {
    //   type: String,
    //   enum: ["days", "weeks", "months"],
    // },

    freeTrialDuration: {
      type: Number,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Plan = mongoose.model<IPlan>("Plan", PlanSchema);
export default Plan;
