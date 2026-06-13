"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/plans";
import { Check, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plan } from "@/types";

interface PricingCardsProps {
  currentPlan?: Plan;
}

export function PricingCards({ currentPlan }: PricingCardsProps) {
  const planOrder: Plan[] = ["basic", "elite"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
      {planOrder.map((planId) => {
        const plan = PLANS[planId];
        const isPro = planId === "elite";
        const isCurrent = currentPlan === planId;

        return (
          <div
            key={planId}
            className={cn(
              "relative rounded-2xl border p-8 flex flex-col transition-all duration-200",
              isPro
                ? "bg-gradient-to-b from-primary/10 to-surface border-primary/40 shadow-xl shadow-primary/10 scale-[1.02]"
                : "bg-surface border-border hover:border-border-light"
            )}
          >
            {isPro && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="primary" className="px-4 py-1 text-xs font-semibold">
                  <Zap className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            {isCurrent && (
              <div className="absolute -top-3 right-4">
                <Badge variant="success" className="px-3 py-1 text-xs">
                  Current Plan
                </Badge>
              </div>
            )}

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-text-primary mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {plan.description}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-text-primary">
                  {plan.priceLabel.replace("/mo", "")}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-muted">/month</span>
                )}
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                      feature.included
                        ? isPro
                          ? "bg-primary/20 text-primary"
                          : "bg-success/10 text-success"
                        : "bg-surface-2 text-muted"
                    )}
                  >
                    {feature.included ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      feature.included ? "text-text-primary" : "text-muted line-through"
                    )}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {isCurrent ? (
              <Button variant="secondary" disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <Link href={currentPlan ? `/account` : `/auth/register`}>
                <Button
                  variant={isPro ? "primary" : "outline"}
                  className="w-full"
                >
                  {currentPlan ? "Upgrade to " + plan.name : "Start " + plan.name}
                </Button>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
