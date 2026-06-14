"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Tag, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DiscountCode() {
  const { data: session } = useSession();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      router.push("/auth/register");
      return;
    }
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (data.success) {
        setResult({ success: true, message: data.message });
        setCode("");
        // Reload after short delay so session/plan updates
        setTimeout(() => router.refresh(), 1500);
      } else {
        setResult({ success: false, message: data.error });
      }
    } catch {
      setResult({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="p-6 rounded-2xl border border-border bg-surface">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Have a discount code?</h3>
        </div>

        <form onSubmit={handleRedeem} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code e.g. LAUNCH50"
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text-primary placeholder:text-muted text-sm focus:outline-none focus:border-primary/60 uppercase tracking-widest"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !code.trim()} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </Button>
        </form>

        {result && (
          <div
            className={cn(
              "mt-3 flex items-center gap-2 text-sm p-3 rounded-xl",
              result.success
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            )}
          >
            {result.success
              ? <CheckCircle className="h-4 w-4 flex-shrink-0" />
              : <XCircle className="h-4 w-4 flex-shrink-0" />}
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
}
