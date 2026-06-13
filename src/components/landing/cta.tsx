import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-surface to-accent/20 border border-primary/20 p-12 text-center">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              Start for free — no credit card needed
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              Ready to gain your edge?
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-8 text-lg">
              Join traders who are making smarter decisions with AI-powered
              market analysis. Start with 3 free analyses per day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="min-w-[200px]">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="lg">
                  See Pro Plans
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted mt-6">
              By signing up, you agree to our{" "}
              <Link href="/disclaimer" className="text-primary hover:underline">
                Disclaimer
              </Link>
              . This is not financial advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
