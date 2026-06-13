export type Recommendation = "BUY" | "SELL" | "HOLD" | "NO_BET";

export type MarketType =
  | "sports_betting"
  | "prediction_market"
  | "financial"
  | "generic";

export type Plan = "basic" | "elite";

export interface AnalysisSignals {
  oddsValue?: string;
  impliedProbability?: string;
  lineMovement?: string;
  volumeIndicator?: string;
  marketSentiment?: string;
  keyFactors?: string[];
}

export interface AnalysisResult {
  id: string;
  recommendation: Recommendation;
  confidence: number;
  reasoning: string;
  marketType: MarketType;
  signals: AnalysisSignals;
  createdAt: string;
}

export interface AnalysisResultWithUser extends AnalysisResult {
  userId: string;
  imageUrl: string;
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanDefinition {
  id: Plan;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  uploadsPerDay: number | null;
  features: PlanFeature[];
  stripePriceId?: string;
}

export interface UsageInfo {
  used: number;
  limit: number | null;
  plan: Plan;
}
