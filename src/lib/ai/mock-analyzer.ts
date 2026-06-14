import { AnalysisResult, MarketType, Recommendation } from "@/types";

type AIAnalysisOutput = Omit<AnalysisResult, "id" | "createdAt">;

const DEMO_RESULTS: AIAnalysisOutput[] = [
  {
    recommendation: "BUY",
    confidence: 74,
    marketType: "sports_betting",
    reasoning: "🔒 Demo result — upgrade to Basic or Elite to get real AI analysis of your uploaded image. This is a sample showing what a BUY signal looks like with full reasoning.",
    signals: {
      oddsValue: "Upgrade to see real odds value analysis",
      impliedProbability: "Upgrade to unlock",
      trueEstimatedProbability: "Upgrade to unlock",
      lineMovement: "Upgrade to unlock",
      volumeIndicator: "High",
      marketSentiment: "Bullish",
      keyFactors: [
        "🔒 Real AI reads your actual screenshot",
        "🔒 Identifies exact teams, odds, and prices",
        "🔒 Calculates true edge vs market price",
      ],
      undervaluedMarkets: ["Upgrade to Basic ($5/mo) to see which specific outcome is undervalued"],
      priceTargets: [],
    },
  },
  {
    recommendation: "SELL",
    confidence: 68,
    marketType: "prediction_market",
    reasoning: "🔒 Demo result — this is a sample SELL signal. Upgrade to Basic or Elite to get real AI analysis that reads your actual screenshot and identifies specific mispriced markets.",
    signals: {
      oddsValue: "Upgrade to see real analysis",
      impliedProbability: "Upgrade to unlock",
      trueEstimatedProbability: "Upgrade to unlock",
      lineMovement: "Upgrade to unlock",
      volumeIndicator: "Medium",
      marketSentiment: "Bearish",
      keyFactors: [
        "🔒 Real AI analyzes your screenshot",
        "🔒 Works on sportsbooks, crypto, stocks, prediction markets",
        "🔒 Gives exact entry, exit, and stop loss levels",
      ],
      undervaluedMarkets: ["Upgrade to Basic ($5/mo) to see real undervalued markets"],
      priceTargets: [],
    },
  },
  {
    recommendation: "HOLD",
    confidence: 55,
    marketType: "crypto",
    reasoning: "🔒 Demo result — sample HOLD signal. The real AI would analyze your actual crypto chart and tell you exactly what to buy, sell, or hold and at what price. Upgrade to unlock.",
    signals: {
      oddsValue: "Upgrade to see real analysis",
      impliedProbability: "Upgrade to unlock",
      trueEstimatedProbability: "Upgrade to unlock",
      lineMovement: "Upgrade to unlock",
      volumeIndicator: "Low",
      marketSentiment: "Neutral",
      keyFactors: [
        "🔒 Reads your actual chart — candlesticks, RSI, MACD",
        "🔒 Identifies support and resistance levels",
        "🔒 Gives specific price targets with stop loss",
      ],
      undervaluedMarkets: ["Upgrade to Basic ($5/mo) to unlock real analysis"],
      priceTargets: [],
    },
  },
];

export async function mockAnalyzeMarketImage(): Promise<AIAnalysisOutput> {
  // Simulate a processing delay so it feels real
  await new Promise((r) => setTimeout(r, 1200));
  return DEMO_RESULTS[Math.floor(Math.random() * DEMO_RESULTS.length)];
}
