import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cx, spring } from "../lib/util";
import { useAI, type Signal } from "./ai";

/**
 * The signature AI surface — emerges from a message, doesn't open a screen.
 * `tone="risk"` recolors it for Scam Shield. Every card carries a "Why AI?" link.
 */
export function AICard({
  children,
  tone = "ai",
  whyAISignals,
  showWhy = true,
  className,
  layoutId,
}: {
  children: ReactNode;
  tone?: "ai" | "risk";
  whyAISignals?: Signal[];
  showWhy?: boolean;
  className?: string;
  layoutId?: string;
}) {
  const { openWhyAI } = useAI();
  const risk = tone === "risk";
  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={spring}
      className={cx(
        "ml-9 w-[86%] overflow-hidden rounded-[20px] p-3.5",
        risk
          ? "bg-risk-soft"
          : "bg-gradient-to-br from-viber-softer to-[#ece6ff]",
        className
      )}
      style={{
        boxShadow: risk
          ? "0 6px 20px rgba(229,72,77,0.14)"
          : "0 8px 24px rgba(115,96,242,0.14)",
      }}
    >
      <div className="mb-2.5 flex items-center gap-1.5">
        <span
          className={cx(
            "flex items-center gap-1 rounded-full bg-surface px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.5px]",
            risk ? "text-risk" : "text-viber"
          )}
        >
          <Sparkles size={11} strokeWidth={2.5} />
          {risk ? "Viber AI · Scam Shield" : "Viber AI"}
        </span>
      </div>
      {children}
      {showWhy && (
        <button
          onClick={() => openWhyAI(whyAISignals)}
          className={cx(
            "mt-3 inline-flex items-center gap-1 text-[12px] font-semibold underline-offset-2 hover:underline",
            risk ? "text-risk/80" : "text-viber-700/80"
          )}
        >
          Why AI? <Sparkles size={11} />
        </button>
      )}
    </motion.div>
  );
}
