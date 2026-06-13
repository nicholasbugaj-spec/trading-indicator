/**
 * AI Analyzer Service
 *
 * This is a mock implementation that simulates AI-powered market analysis.
 * To plug in real vision AI, replace the `analyzeWithAI` function body with:
 *
 * --- OpenAI Vision ---
 * import OpenAI from "openai";
 * const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 * const response = await openai.chat.completions.create({
 *   model: "gpt-4-vision-preview",
 *   messages: [{
 *     role: "user",
 *     content: [
 *       { type: "text", text: ANALYSIS_PROMPT },
 *       { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBuffer.toString("base64")}` } }
 *     ]
 *   }],
 *   max_tokens: 1000,
 * });
 * return JSON.parse(response.choices[0].message.content!);
 *
 * --- Anthropic Claude Vision ---
 * import Anthropic from "@anthropic-ai/sdk";
 * const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 * const response = await client.messages.create({
 *   model: "claude-3-5-sonnet-20241022",
 *   max_tokens: 1000,
 *   messages: [{
 *     role: "user",
 *     content: [
 *       { type: "image", source: { type: "base64", media_type: mimeType, data: imageBuffer.toString("base64") } },
 *       { type: "text", text: ANALYSIS_PROMPT }
 *     ]
 *   }]
 * });
 * return JSON.parse((response.content[0] as { text: string }).text);
 */

import { AnalysisResult, MarketType, Recommendation } from "@/types";

// The prompt to use when integrating real vision AI
export const ANALYSIS_PROMPT = `
You are an expert trading and betting market analyst. Analyze the provided screenshot of a betting/prediction market and return a JSON object with:

{
  "recommendation": "BUY" | "SELL" | "HOLD" | "NO_BET",
  "confidence": number (0-100),
  "reasoning": "Detailed explanation of your analysis",
  "marketType": "sports_betting" | "prediction_market" | "financial" | "generic",
  "signals": {
    "oddsValue": "Description of odds value",
    "impliedProbability": "X%",
    "lineMovement": "Description of line movement",
    "volumeIndicator": "High/Medium/Low",
    "marketSentiment": "Bullish/Bearish/Neutral",
    "keyFactors": ["factor1", "factor2", "factor3"]
  }
}

Rules:
- BUY: Strong positive edge detected, odds undervalued relative to true probability
- SELL: Lay the bet/position, market overpricing the event
- HOLD: Current position is fair value, no clear edge
- NO_BET: Insufficient data, too much uncertainty, or no edge detected
- Be conservative: lean toward HOLD/NO_BET when signals are mixed
`;

type AIAnalysisOutput = Omit<AnalysisResult, "id" | "createdAt">;

// Weighted random selection helper
function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return items[i];
  }
  return items[items.length - 1];
}

// Simulate OCR signal extraction from different market types
function simulateMarketDetection(imageSize: number): MarketType {
  // In real implementation, the AI would determine this from the image
  // Here we simulate based on image characteristics
  const types: MarketType[] = [
    "sports_betting",
    "prediction_market",
    "financial",
    "generic",
  ];
  const weights = [0.45, 0.3, 0.15, 0.1];
  return weightedRandom(types, weights);
}

function generateSportsSignals(recommendation: Recommendation) {
  const lineMovements = [
    "Line moved 2.5 points in favor of underdog",
    "Sharp money detected on favorite",
    "Reverse line movement present",
    "No significant line movement",
    "Steam move detected — sharp consensus",
    "Public overreacting to recent loss",
  ];

  const volumes = ["High", "Medium", "Low"];
  const sentiments = ["Bullish", "Bearish", "Neutral", "Mixed"];

  return {
    oddsValue:
      recommendation === "BUY"
        ? "Odds appear undervalued by 8-12%"
        : recommendation === "SELL"
        ? "Market overpricing by 10-15%"
        : "Near fair value",
    impliedProbability: `${Math.floor(Math.random() * 35) + 45}%`,
    lineMovement: lineMovements[Math.floor(Math.random() * lineMovements.length)],
    volumeIndicator: volumes[Math.floor(Math.random() * volumes.length)],
    marketSentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    keyFactors: [
      "Closing line value analysis",
      "Sharp vs. public money split",
      "Historical situational matchup",
    ],
  };
}

function generatePredictionSignals(recommendation: Recommendation) {
  return {
    oddsValue:
      recommendation === "BUY"
        ? "YES contract underpriced relative to base rate"
        : recommendation === "SELL"
        ? "NO contract offers better expected value"
        : "Contracts near fair value",
    impliedProbability: `${Math.floor(Math.random() * 40) + 30}%`,
    lineMovement: "Probability shifted 5-8% over last 24h",
    volumeIndicator: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
    marketSentiment: ["Bullish", "Bearish", "Neutral"][
      Math.floor(Math.random() * 3)
    ],
    keyFactors: [
      "Base rate comparison",
      "Recent news sentiment",
      "Resolution criteria clarity",
    ],
  };
}

function generateFinancialSignals(recommendation: Recommendation) {
  return {
    oddsValue:
      recommendation === "BUY"
        ? "Oversold on RSI, potential bounce"
        : recommendation === "SELL"
        ? "Overbought conditions detected"
        : "Consolidating in range",
    impliedProbability: `${Math.floor(Math.random() * 30) + 40}%`,
    lineMovement: `${recommendation === "BUY" ? "+" : "-"}${(Math.random() * 3 + 0.5).toFixed(1)}% price action`,
    volumeIndicator: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
    marketSentiment: ["Bullish", "Bearish", "Neutral"][
      Math.floor(Math.random() * 3)
    ],
    keyFactors: [
      "Technical pattern formation",
      "Volume confirmation",
      "Support/resistance levels",
    ],
  };
}

// Generate realistic reasoning for each recommendation
function generateReasoning(
  recommendation: Recommendation,
  marketType: MarketType,
  confidence: number
): string {
  const reasons: Record<Recommendation, Record<string, string[]>> = {
    BUY: {
      sports_betting: [
        `The analysis reveals a significant pricing inefficiency in this market. The implied probability extracted from the screenshot suggests the true win probability is undervalued by approximately ${Math.floor(Math.random() * 10) + 5}%. Sharp action appears to be on this side, with reverse line movement detected. The closing line value (CLV) expectation is positive. Key indicators: favorable matchup historically, situational edge present.`,
        `Strong BUY signal detected. The market has moved against recent sharp money, creating value. Our model estimates this side is priced at ${Math.floor(Math.random() * 8) + 4}% below fair value. Public perception appears to be distorted by recency bias following recent results. Historical performance in similar situations supports this position.`,
      ],
      prediction_market: [
        `The YES contract appears underpriced relative to base rates and recent information flow. Our OCR analysis detected probability indicators suggesting the market has not fully priced in recent developments. Expected value is positive at current pricing. Resolution criteria appear favorable.`,
      ],
      financial: [
        `Technical indicators suggest oversold conditions with potential for mean reversion. Volume patterns support accumulation phase. Risk/reward ratio is favorable at current levels. Stop-loss levels are well-defined.`,
      ],
      generic: [
        `Multiple positive signals detected in the uploaded image. The risk/reward ratio appears favorable based on visible data points. Confidence is ${confidence >= 70 ? "high" : "moderate"} given the available information.`,
      ],
    },
    SELL: {
      sports_betting: [
        `LAY signal detected. The favorite appears significantly overpriced, likely due to public perception and media narrative rather than underlying value. Our analysis suggests the implied probability exceeds true probability by ${Math.floor(Math.random() * 12) + 6}%. Fading heavy public sides historically generates long-term profit.`,
        `The market is exhibiting classic public overreaction patterns. Significant juice indicates a square-heavy betting side. Sharp money appears to be fading this position based on line movement patterns detected.`,
      ],
      prediction_market: [
        `The NO contract offers better expected value at current pricing. The YES side appears inflated by recent news cycles without fundamental support. Historical resolution rates for similar contracts suggest probability should be lower.`,
      ],
      financial: [
        `Overbought technical signals with divergence on momentum indicators. Distribution patterns visible in volume data. Near key resistance levels with high risk of reversal.`,
      ],
      generic: [
        `Analysis indicates negative expected value at current pricing. The risk/reward ratio is unfavorable. Multiple bearish signals detected in the available data.`,
      ],
    },
    HOLD: {
      sports_betting: [
        `The market appears efficiently priced at this time. No significant edge detected in either direction. The implied probability aligns closely with our estimated true probability. Recommend waiting for line movement or additional information before taking a position.`,
      ],
      prediction_market: [
        `The contract pricing reflects fair value based on available information. Expected value is approximately neutral. Better opportunities may exist elsewhere. Monitor for significant developments that could create mispricing.`,
      ],
      financial: [
        `Market is in a consolidation phase. Signals are mixed with no clear directional bias. Waiting for a breakout confirmation or clearer entry signal is advisable.`,
      ],
      generic: [
        `Signals are balanced with no strong directional edge. The data visible in the screenshot does not present a compelling case for either direction. HOLD until more clarity emerges.`,
      ],
    },
    NO_BET: {
      sports_betting: [
        `Insufficient information detected to make a confident recommendation. The screenshot may be missing key data points such as clear odds, team matchup details, or line movement history. Avoid this market until more information is available.`,
        `Market conditions are too uncertain for a confident position. The image analysis detected potential injury news or weather factors that introduce too much variance. Recommended action: Pass on this market.`,
      ],
      prediction_market: [
        `Resolution criteria appear ambiguous or the event has too many unknown variables. The risk profile does not justify the potential reward at current odds. Passing is the disciplined play here.`,
      ],
      financial: [
        `High volatility environment with no clear setup. The chart pattern is ambiguous and multiple conflicting signals are present. Capital preservation takes priority — no trade until conditions clarify.`,
      ],
      generic: [
        `The image did not contain sufficient market data to generate a reliable analysis. Please upload a clearer screenshot that includes pricing information, odds, or other relevant market data.`,
      ],
    },
  };

  const marketReasons = reasons[recommendation][marketType] ??
    reasons[recommendation]["generic"] ?? ["Analysis complete."];
  return marketReasons[Math.floor(Math.random() * marketReasons.length)];
}

// Simulate analysis delay (to feel realistic)
function simulateProcessingDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 800) + 400; // 400-1200ms
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Main analysis function
 * @param imageBuffer - The image file buffer
 * @param mimeType - The MIME type of the image
 * @returns Analysis result
 */
export async function analyzeMarketImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<AIAnalysisOutput> {
  // Simulate AI processing time
  await simulateProcessingDelay();

  // Detect market type based on image characteristics (mocked)
  const marketType = simulateMarketDetection(imageBuffer.length);

  // Weighted recommendation distribution — BUY/SELL more common for engaged users
  // Real AI would extract this from the actual image content
  const recommendation = weightedRandom<Recommendation>(
    ["BUY", "SELL", "HOLD", "NO_BET"],
    [0.3, 0.25, 0.3, 0.15]
  );

  // Confidence varies by recommendation type — NO_BET tends to be lower confidence
  let confidence: number;
  switch (recommendation) {
    case "BUY":
      confidence = Math.floor(Math.random() * 35) + 55; // 55-90
      break;
    case "SELL":
      confidence = Math.floor(Math.random() * 30) + 55; // 55-85
      break;
    case "HOLD":
      confidence = Math.floor(Math.random() * 25) + 50; // 50-75
      break;
    case "NO_BET":
      confidence = Math.floor(Math.random() * 30) + 35; // 35-65
      break;
    default:
      confidence = 50;
  }

  // Generate signals based on market type
  let signals;
  switch (marketType) {
    case "sports_betting":
      signals = generateSportsSignals(recommendation);
      break;
    case "prediction_market":
      signals = generatePredictionSignals(recommendation);
      break;
    case "financial":
      signals = generateFinancialSignals(recommendation);
      break;
    default:
      signals = generateSportsSignals(recommendation);
  }

  const reasoning = generateReasoning(recommendation, marketType, confidence);

  return {
    recommendation,
    confidence,
    reasoning,
    marketType,
    signals,
  };
}
