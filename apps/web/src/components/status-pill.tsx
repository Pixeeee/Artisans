import type { ReactNode } from "react";

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" }) {
  const color =
    tone === "good"
      ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100"
      : tone === "warn"
        ? "border-[var(--artisans-orange)]/50 bg-[var(--artisans-orange)]/15 text-orange-100"
        : "border-white/18 bg-white/8 text-white/72";

  return <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${color}`}>{children}</span>;
}
