import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

export type PlanId = "pro_monthly" | "career_premium" | "lifetime_egypt";
export type PaymentProvider = "stripe" | "paymob" | "fawry";

export const createCheckoutSession = async (planId: PlanId, provider: PaymentProvider) => {
  const callable = httpsCallable<
    { planId: PlanId; provider: PaymentProvider },
    { checkoutUrl: string }
  >(functions, "createCheckoutSession");

  const result = await callable({ planId, provider });
  return result.data.checkoutUrl;
};
