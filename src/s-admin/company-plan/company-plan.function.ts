import { IPlan } from "../plan/plan.model.ts";

export const calcPlanTime = (planDoc: IPlan, startDate: Date) => {
  let duration = 0;

  if (planDoc.planType == "monthly") {
    duration = 30;
  } else if (planDoc.planType == "yearly") {
    duration = 365;
  } else if (planDoc.planType == "lifetime") {
    duration = -1;
  } else {
    duration = 0;
  }

  let endDate: Date | null = null;

  if (duration !== -1) {
    endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
  }

  return { duration, endDate };
};
