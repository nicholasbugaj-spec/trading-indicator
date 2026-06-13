import { Plan, PlanDefinition } from "@/types";

export const PLANS: Record<Plan, PlanDefinition> = {
  basic: {
    id: "basic",
    name: "Basic",
    price: 5,
    priceLabel: "$5/mo",
    description: "Everything you need to start trading smarter",
    uploadsPerDay: 20,
    stripePriceId: "price_basic_monthly",
    features: [
      { text: "20 analyses per day", included: true },
      { text: "BUY/SELL/HOLD/NO BET signal", included: true },
      { text: "Market type detection", included: true },
      { text: "Confidence score", included: true },
      { text: "Detailed reasoning", included: true },
      { text: "Signal breakdown", included: false },
      { text: "History export", included: false },
      { text: "Priority support", included: false },
    ],
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: 12,
    priceLabel: "$12/mo",
    description: "Full power for serious traders",
    uploadsPerDay: null,
    stripePriceId: "price_elite_monthly",
    features: [
      { text: "Unlimited analyses", included: true },
      { text: "BUY/SELL/HOLD/NO BET signal", included: true },
      { text: "Market type detection", included: true },
      { text: "Confidence score", included: true },
      { text: "Detailed reasoning", included: true },
      { text: "Signal breakdown", included: true },
      { text: "History export", included: true },
      { text: "Priority support", included: true },
    ],
  },
};

export function getPlan(planId: string): PlanDefinition {
  return PLANS[planId as Plan] ?? PLANS.basic;
}

export function canUpload(plan: Plan, uploadsToday: number): boolean {
  const planDef = PLANS[plan];
  if (planDef.uploadsPerDay === null) return true;
  return uploadsToday < planDef.uploadsPerDay;
}

export function showConfidenceScore(plan: Plan): boolean {
  return plan === "basic" || plan === "elite";
}

export function showDetailedReasoning(plan: Plan): boolean {
  return plan === "basic" || plan === "elite";
}

export function showSignalBreakdown(plan: Plan): boolean {
  return plan === "elite";
}
