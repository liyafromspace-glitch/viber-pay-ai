import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cx, spring } from "../lib/util";

export function Row({
  me = false,
  children,
  className,
}: {
  me?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex w-full", me ? "justify-end" : "justify-start", className)}>{children}</div>
  );
}

/**
 * A message bubble. `me` renders the outgoing lavender style; incoming is warm white.
 * Bubbles carry a shared `layout` so they can morph into payment cards in place.
 */
export function Bubble({
  me = false,
  time,
  status,
  children,
  className,
  layoutId,
}: {
  me?: boolean;
  time?: string;
  status?: "sent" | "delivered" | "read";
  children: ReactNode;
  className?: string;
  layoutId?: string;
}) {
  return (
    <motion.div
      layout={layoutId ? undefined : "position"}
      layoutId={layoutId}
      transition={spring}
      className={cx(
        "relative max-w-[80%] px-3.5 py-2.5 text-[14.5px] leading-[1.35]",
        me
          ? "rounded-[18px] rounded-br-[6px] bg-[#e7e1fb] text-ink"
          : "rounded-[18px] rounded-bl-[6px] bg-surface text-ink shadow-[0_1px_2px_rgba(23,21,50,0.06)]",
        className
      )}
    >
      {children}
      {(time || status) && (
        <div
          className={cx(
            "mt-1 flex items-center justify-end gap-1 text-[10.5px]",
            me ? "text-viber-700/60" : "text-ink-3"
          )}
        >
          {time}
          {status && me && (
            <span className={cx(status === "read" ? "text-viber" : "text-ink-3")}>
              {status === "sent" ? "✓" : "✓✓"}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
