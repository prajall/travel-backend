import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPlan extends Document {
  title: string;
  subTitle?: string;
  modules: Types.ObjectId[];
  planType: "yearly" | "monthly" | "lifetime" | "custom";
  price: number;
  discount?: number;
  isFreeTrialEnabled?: boolean;
  freeTrialDuration?: number; // in days
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
