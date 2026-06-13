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

import { AnalysisResult, MarketType, PriceTarget, Recommendation } from "@/types";

// The prompt to use when integrating real vision AI
export const ANALYSIS_PROMPT = `
You are an expert trading and betting market analyst. Analyze the provided screenshot of a betting/prediction market and return a JSON object with:

{
  "recommendation": "BUY" | "SELL" | "HOLD" | "NO_BET",
  "confidence": number (0-100),
  "reasoning": "Detailed explanation of your analysis",
  "marketType": "sports_betting" | "prediction_market" | "financial" | "generic",
  "signals": {
    "oddsValue": "Description of overall odds value",
    "impliedProbability": "X% (market-implied)",
    "trueEstimatedProbability": "X% (your true estimate)",
    "lineMovement": "Description of line movement",
    "volumeIndicator": "High/Medium/Low",
    "marketSentiment": "Bullish/Bearish/Neutral",
    "keyFactors": ["factor1", "factor2", "factor3"],
    "undervaluedMarkets": ["Outcome A is undervalued by X%", "Outcome B offers value"],
    "priceTargets": [
      {
        "action": "BUY" | "SELL" | "HOLD",
        "outcome": "Which outcome/side to bet",
        "currentOdds": "Current market price",
        "targetEntry": "Best price to enter at",
        "targetExit": "Take profit at this level",
        "stopLoss": "Exit if it reaches this level",
        "edgePercent": "+X.X% edge",
        "undervalued": true | false
      }
    ]
  }
}

Rules:
- BUY: Odds undervalued — true probability higher than implied. Enter now or at target entry.
- SELL: Lay this outcome — market is overpricing it. Fade the public.
- HOLD: Fair value. No edge. Wait for a better price.
- NO_BET: Too much uncertainty or missing data. Skip.
- Always include at least one priceTarget entry.
- Be specific with prices/odds in priceTargets.
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

function r(min: number, max: number) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function decimalOdds() {
  return (Math.random() * 4 + 1.3).toFixed(2);
}

function buildPriceTargets(recommendation: Recommendation, marketType: MarketType): PriceTarget[] {
  if (recommendation === "NO_BET") return [];

  const targets: PriceTarget[] = [];

  if (marketType === "sports_betting") {
    const currentOdds = decimalOdds();
    const current = parseFloat(currentOdds);
    const edge = r(4, 14);
    const isBuy = recommendation === "BUY";

    targets.push({
      action: recommendation === "HOLD" ? "HOLD" : isBuy ? "BUY" : "SELL",
      outcome: isBuy ? "Back the underdog / sharp side" : "Lay the favourite / fade public",
      currentOdds,
      targetEntry: isBuy
        ? (current + r(0.05, 0.2)).toFixed(2)
        : (current - r(0.05, 0.2)).toFixed(2),
      targetExit: isBuy
        ? (current * (1 + edge / 100 + 0.1)).toFixed(2)
        : (current * (1 - edge / 100 - 0.05)).toFixed(2),
      stopLoss: isBuy
        ? (current - r(0.1, 0.3)).toFixed(2)
        : (current + r(0.1, 0.25)).toFixed(2),
      edgePercent: `+${edge}% edge`,
      undervalued: isBuy,
    });

    if (recommendation !== "HOLD") {
      const altOdds = decimalOdds();
      targets.push({
        action: "HOLD",
        outcome: "Opposite side — wait for better line",
        currentOdds: altOdds,
        targetEntry: (parseFloat(altOdds) + r(0.15, 0.4)).toFixed(2),
        targetExit: "N/A — no edge yet",
        stopLoss: "N/A",
        edgePercent: "0% — no edge currently",
        undervalued: false,
      });
    }
  } else if (marketType === "prediction_market") {
    const yesPrice = r(0.25, 0.75);
    const noPrice = +(1 - yesPrice).toFixed(2);
    const edge = r(5, 18);
    const isBuy = recommendation === "BUY";

    targets.push({
      action: isBuy ? "BUY" : "SELL",
      outcome: isBuy ? "YES contract" : "NO contract (or sell YES)",
      currentOdds: `$${yesPrice.toFixed(2)} per share`,
      targetEntry: isBuy
        ? `$${(yesPrice - r(0.02, 0.06)).toFixed(2)} or better`
        : `$${(noPrice - r(0.02, 0.06)).toFixed(2)} or better`,
      targetExit: isBuy
        ? `$${Math.min(yesPrice + r(0.1, 0.25), 0.97).toFixed(2)}`
        : `$${Math.max(noPrice + r(0.08, 0.2), 0.05).toFixed(2)}`,
      stopLoss: isBuy
        ? `$${(yesPrice - r(0.08, 0.15)).toFixed(2)}`
        : `$${(noPrice - r(0.08, 0.15)).toFixed(2)}`,
      edgePercent: `+${edge}% edge vs true probability`,
      undervalued: isBuy,
    });
  } else {
    // financial / generic
    const price = r(80, 500);
    const edge = r(3, 12);
    const isBuy = recommendation === "BUY";

    targets.push({
      action: isBuy ? "BUY" : "SELL",
      outcome: isBuy ? "Long position" : "Short / exit long",
      currentOdds: `$${price.toFixed(2)}`,
      targetEntry: isBuy
        ? `$${(price - r(1, price * 0.02)).toFixed(2)}`
        : `$${(price + r(1, price * 0.015)).toFixed(2)}`,
      targetExit: isBuy
        ? `$${(price * (1 + edge / 100)).toFixed(2)}`
        : `$${(price * (1 - edge / 100)).toFixed(2)}`,
      stopLoss: isBuy
        ? `$${(price * 0.97).toFixed(2)} (−3%)`
        : `$${(price * 1.025).toFixed(2)} (+2.5%)`,
      edgePercent: `+${edge}% expected move`,
      undervalued: isBuy,
    });
  }

  return targets;
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

  const impliedProb = Math.floor(Math.random() * 35) + 45;
  const trueProb = recommendation === "BUY"
    ? impliedProb + Math.floor(Math.random() * 12) + 5
    : recommendation === "SELL"
    ? impliedProb - Math.floor(Math.random() * 12) - 5
    : impliedProb + Math.floor(Math.random() * 3) - 1;

  const undervaluedMarkets = recommendation === "BUY"
    ? [
        `Underdog win market: implied ${impliedProb}% vs true est. ${Math.min(trueProb, 99)}% — undervalued by ~${Math.abs(trueProb - impliedProb)}%`,
        "Alternative handicap line offers additional value",
      ]
    : recommendation === "SELL"
    ? [
        `Favourite is overpriced: implied ${impliedProb}% vs true est. ~${Math.max(trueProb, 1)}% — overvalued by ~${Math.abs(impliedProb - trueProb)}%`,
      ]
    : ["No clearly undervalued outcome detected at current prices"];

  return {
    oddsValue:
      recommendation === "BUY"
        ? `Odds undervalued by ~${Math.abs(trueProb - impliedProb)}% relative to true probability`
        : recommendation === "SELL"
        ? `Market overpricing favourite by ~${Math.abs(impliedProb - trueProb)}%`
        : "Near fair value — no significant edge",
    impliedProbability: `${impliedProb}%`,
    trueEstimatedProbability: `${Math.min(Math.max(trueProb, 1), 99)}%`,
    lineMovement: lineMovements[Math.floor(Math.random() * lineMovements.length)],
    volumeIndicator: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
    marketSentiment: ["Bullish", "Bearish", "Neutral", "Mixed"][Math.floor(Math.random() * 4)],
    keyFactors: [
      "Closing line value (CLV) analysis",
      "Sharp vs. public money split",
      "Historical situational matchup edge",
    ],
    undervaluedMarkets,
    priceTargets: buildPriceTargets(recommendation, "sports_betting"),
  };
}

function generatePredictionSignals(recommendation: Recommendation) {
  const impliedProb = Math.floor(Math.random() * 40) + 30;
  const trueProb = recommendation === "BUY"
    ? impliedProb + Math.floor(Math.random() * 15) + 6
    : recommendation === "SELL"
    ? impliedProb - Math.floor(Math.random() * 15) - 6
    : impliedProb;

  const undervaluedMarkets = recommendation === "BUY"
    ? [`YES contract: market at ${impliedProb}¢, true estimate ${Math.min(trueProb, 99)}¢ — buy under ${Math.min(trueProb - 3, 95)}¢`]
    : recommendation === "SELL"
    ? [`NO contract offers value: YES overpriced at ${impliedProb}¢ vs true est. ${Math.max(trueProb, 1)}¢`]
    : ["Both YES/NO near fair value — no edge currently"];

  return {
    oddsValue:
      recommendation === "BUY"
        ? "YES contract underpriced relative to base rate and news flow"
        : recommendation === "SELL"
        ? "NO contract offers better expected value — YES inflated"
        : "Contracts near fair value",
    impliedProbability: `${impliedProb}%`,
    trueEstimatedProbability: `${Math.min(Math.max(trueProb, 1), 99)}%`,
    lineMovement: "Probability shifted 5-8% over last 24h",
    volumeIndicator: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
    marketSentiment: ["Bullish", "Bearish", "Neutral"][Math.floor(Math.random() * 3)],
    keyFactors: [
      "Base rate vs. current pricing comparison",
      "Recent news sentiment analysis",
      "Resolution criteria clarity score",
    ],
    undervaluedMarkets,
    priceTargets: buildPriceTargets(recommendation, "prediction_market"),
  };
}

function generateFinancialSignals(recommendation: Recommendation) {
  const impliedProb = Math.floor(Math.random() * 30) + 40;
  const trueProb = recommendation === "BUY"
    ? impliedProb + Math.floor(Math.random() * 10) + 5
    : recommendation === "SELL"
    ? impliedProb - Math.floor(Math.random() * 10) - 5
    : impliedProb;

  return {
    oddsValue:
      recommendation === "BUY"
        ? "Oversold on RSI — potential mean reversion bounce"
        : recommendation === "SELL"
        ? "Overbought — distribution pattern forming near resistance"
        : "Consolidating in range — no directional bias",
    impliedProbability: `${impliedProb}% upside probability`,
    trueEstimatedProbability: `${Math.min(Math.max(trueProb, 1), 99)}% estimated`,
    lineMovement: `${recommendation === "BUY" ? "+" : "-"}${(Math.random() * 3 + 0.5).toFixed(1)}% recent price action`,
    volumeIndicator: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
    marketSentiment: ["Bullish", "Bearish", "Neutral"][Math.floor(Math.random() * 3)],
    keyFactors: [
      "Technical pattern formation",
      "Volume confirmation on breakout",
      "Key support/resistance levels",
    ],
    undervaluedMarkets:
      recommendation === "BUY"
        ? ["Long side undervalued relative to fair value estimate", "Risk/reward skewed positively at current level"]
        : recommendation === "SELL"
        ? ["Short opportunity — price above fair value estimate"]
        : ["No clear mispricing detected at current levels"],
    priceTargets: buildPriceTargets(recommendation, "financial"),
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
