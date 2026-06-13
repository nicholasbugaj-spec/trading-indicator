import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8 animate-fade-in">
          <Zap className="h-3.5 w-3.5" />
          AI-Powered Market Intelligence
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary leading-tight tracking-tight animate-slide-up mb-6">
          Trade Smarter.{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
            Bet Sharper.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-slide-up mb-10">
          Upload a screenshot of any betting or prediction market. Our AI
          analyzes the data and delivers instant{" "}
          <span className="text-text-primary font-medium">
            BUY / SELL / HOLD
          </span>{" "}
          signals with confidence scores and detailed reasoning.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in mb-16">
          <Link href="/auth/register">
            <Button size="lg" className="min-w-[180px]">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary" size="lg" className="min-w-[180px]">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>3 free analyses/day</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Instant results</span>
          </div>
        </div>

        {/* Hero card preview */}
        <div className="mt-20 max-w-2xl mx-auto">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted text-center">
                tradesharp.app/dashboard
              </div>
            </div>

            {/* Fake dashboard content */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Fake upload area */}
                <div className="w-32 h-24 rounded-lg bg-surface-2 border border-dashed border-border-light flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <TrendingUp className="h-6 w-6 text-muted mx-auto mb-1" />
                    <p className="text-xs text-muted">screenshot.png</p>
                  </div>
                </div>

                {/* Fake result */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="px-4 py-2 rounded-lg bg-success/10 border border-success/20 text-success font-bold text-xl">
                      BUY
                    </div>
                    <div>
                      <p className="text-xs text-muted">Confidence</p>
                      <p className="text-lg font-bold text-success">82%</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{ width: "82%" }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Strong positive edge detected. Sharp money on underdog with
                    reverse line movement. Implied probability undervalued by
                    ~9%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
