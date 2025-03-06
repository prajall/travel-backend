import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  _id: mongoose.Types.ObjectId | string;
  title: string;
  modules: string[];
  pricingType: "yearly" | "monthly" | "lifetime" | "custom";
  price: number;
  //   currency: string;
  isFreeTrialEnabled: boolean;
  //   freeTrialDurationType?: "days" | "weeks" | "months";
  freeTrialDuration?: number;
  isFeatureBasedPricing: boolean;
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

    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],

    planType: {
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

    isFreeTrialEnabled: {
      type: Boolean,
      default: false,
    },
    freeTrialDuration: {
      type: Number, //days
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Plan = mongoose.model<IPlan>("Plan", PlanSchema);
export default Plan;
