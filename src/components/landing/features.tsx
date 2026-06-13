import {
  Upload,
  Brain,
  BarChart3,
  ShieldCheck,
  Zap,
  History,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Simple Screenshot Upload",
    description:
      "Drag and drop any screenshot from betting sites, Polymarket, Kalshi, or financial charts. We handle the rest.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI Vision Analysis",
    description:
      "Our AI reads market data, odds, line movement, and sentiment to generate actionable trading signals.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: BarChart3,
    title: "Confidence Scoring",
    description:
      "Every signal comes with a 0-100 confidence score so you know when the edge is strong vs. marginal.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get BUY/SELL/HOLD/NO BET signals in seconds. No waiting, no complex setup.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Market Support",
    description:
      "Sports betting, prediction markets, financial derivatives — our AI adapts to any market type.",
    color: "text-primary-light",
    bg: "bg-primary/10",
  },
  {
    icon: History,
    title: "Analysis History",
    description:
      "Review every past analysis, track your performance over time, and refine your edge.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export function Features() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              gain an edge
            </span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Professional-grade market analysis tools, powered by artificial
            intelligence, accessible to everyone.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-surface border border-border hover:border-border-light hover:bg-surface-2 transition-all duration-200"
            >
              <div
                className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="text-3xl font-bold text-text-primary">
              Three steps to sharper trades
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20" />

            {[
              {
                step: "01",
                title: "Upload Screenshot",
                description:
                  "Take a screenshot of any betting market or prediction market and upload it to the dashboard.",
              },
              {
                step: "02",
                title: "AI Analyzes Data",
                description:
                  "Our AI extracts odds, line movement, implied probabilities, and market sentiment from your image.",
              },
              {
                step: "03",
                title: "Get Your Signal",
                description:
                  "Receive a clear BUY/SELL/HOLD/NO BET recommendation with confidence score and detailed reasoning.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 mb-6 text-3xl font-black text-primary">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
