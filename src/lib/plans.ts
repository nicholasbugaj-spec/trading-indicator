import { Plan, PlanDefinition } from "@/types";

export const PLANS: Record<Plan, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    priceLabel: "Free",
    description: "Try it out — demo analysis, no card required",
    uploadsPerDay: 3,
    features: [
      { text: "3 demo analyses per day", included: true },
      { text: "BUY/SELL/HOLD signal (demo)", included: true },
      { text: "Market type detection", included: true },
      { text: "Real AI analysis", included: false },
      { text: "Confidence score", included: false },
      { text: "Detailed reasoning", included: false },
      { text: "Price targets & entry points", included: false },
      { text: "Priority support", included: false },
    ],
  },
  basic: {
    id: "basic",
    name: "Basic",
    price: 5,
    priceLabel: "$5/mo",
    description: "Real AI analysis on every upload",
    uploadsPerDay: 20,
    stripePriceId: "price_basic_monthly",
    features: [
      { text: "20 real AI analyses per day", included: true },
      { text: "BUY/SELL/HOLD/NO BET signal", included: true },
      { text: "Market type detection", included: true },
      { text: "Real AI analysis", included: true },
      { text: "Confidence score", included: true },
      { text: "Detailed reasoning", included: true },
      { text: "Price targets & entry points", included: false },
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
      { text: "Unlimited real AI analyses", included: true },
      { text: "BUY/SELL/HOLD/NO BET signal", included: true },
      { text: "Market type detection", included: true },
      { text: "Real AI analysis", included: true },
      { text: "Confidence score", included: true },
      { text: "Detailed reasoning", included: true },
      { text: "Price targets & entry points", included: true },
      { text: "Priority support", included: true },
    ],
  },
};

export function getPlan(planId: string): PlanDefinition {
  return PLANS[planId as Plan] ?? PLANS.free;
}

export function canUpload(plan: Plan, uploadsToday: number): boolean {
  const planDef = PLANS[plan];
  if (planDef.uploadsPerDay === null) return true;
  return uploadsToday < planDef.uploadsPerDay;
}

// Free plan gets mock results — no API call
export function useRealAI(plan: Plan): boolean {
  return plan === "basic" || plan === "elite";
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
