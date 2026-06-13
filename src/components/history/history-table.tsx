"use client";

import { AnalysisResult } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getRecommendationBg, formatDateShort, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Ban, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HistoryTableProps {
  analyses: AnalysisResult[];
  showConfidence: boolean;
}

function RecIcon({ rec }: { rec: string }) {
  const cls = "h-3.5 w-3.5";
  switch (rec) {
    case "BUY": return <TrendingUp className={cls} />;
    case "SELL": return <TrendingDown className={cls} />;
    case "HOLD": return <Minus className={cls} />;
    case "NO_BET": return <Ban className={cls} />;
    default: return <Minus className={cls} />;
  }
}

function RecBadge({ rec }: { rec: string }) {
  const bg = getRecommendationBg(rec);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
        bg
      )}
    >
      <RecIcon rec={rec} />
      {rec.replace("_", " ")}
    </span>
  );
}

export function HistoryTable({ analyses, showConfidence }: HistoryTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (analyses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-7 w-7 text-muted" />
        </div>
        <p className="text-text-primary font-medium mb-1">No analyses yet</p>
        <p className="text-sm text-text-secondary mb-4">
          Upload your first screenshot to get started
        </p>
        <Link href="/dashboard" className="text-sm text-primary hover:underline">
          Go to Dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Desktop table header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted uppercase tracking-wider">
        <div className="col-span-2">Date</div>
        <div className="col-span-3">Recommendation</div>
        <div className="col-span-2">Confidence</div>
        <div className="col-span-2">Market Type</div>
        <div className="col-span-3">Reasoning Preview</div>
      </div>

      {analyses.map((analysis) => (
        <div key={analysis.id}>
          <button
            onClick={() =>
              setExpanded(expanded === analysis.id ? null : analysis.id)
            }
            className="w-full text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 rounded-xl bg-surface border border-border hover:border-border-light hover:bg-surface-2 transition-all duration-150 items-center">
              {/* Date */}
              <div className="md:col-span-2">
                <p className="text-sm text-text-secondary">
                  {formatDateShort(analysis.createdAt)}
                </p>
              </div>

              {/* Rec */}
              <div className="md:col-span-3">
                <RecBadge rec={analysis.recommendation} />
              </div>

              {/* Confidence */}
              <div className="md:col-span-2">
                {showConfidence ? (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          analysis.confidence >= 75
                            ? "bg-success"
                            : analysis.confidence >= 50
                            ? "bg-warning"
                            : "bg-danger"
                        )}
                        style={{ width: `${analysis.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-text-primary">
                      {analysis.confidence}%
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted">
                    <Lock className="h-3 w-3" />
                    <span className="text-xs">Pro</span>
                  </div>
                )}
              </div>

              {/* Market type */}
              <div className="md:col-span-2">
                <Badge variant="default" className="text-xs capitalize">
                  {analysis.marketType.replace("_", " ")}
                </Badge>
              </div>

              {/* Reasoning preview */}
              <div className="md:col-span-3 flex items-center justify-between gap-2">
                <p className="text-xs text-text-secondary truncate">
                  {analysis.reasoning.substring(0, 60)}...
                </p>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted transition-transform flex-shrink-0",
                    expanded === analysis.id && "rotate-90"
                  )}
                />
              </div>
            </div>
          </button>

          {/* Expanded reasoning */}
          {expanded === analysis.id && (
            <div className="ml-4 mr-4 -mt-1 p-4 bg-surface-2 border border-border border-t-0 rounded-b-xl animate-fade-in">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
                Full Reasoning
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {analysis.reasoning}
              </p>
              {analysis.signals?.keyFactors && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
                    Key Factors
                  </p>
                  <ul className="space-y-1">
                    {analysis.signals.keyFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-primary mt-0.5">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
