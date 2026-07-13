import type { ReactNode } from "react";
import { forwardRef } from "react";
import { StatusBar } from "./Chrome";

/** Physical device shell — 390 × 844 content area with a soft bezel + dynamic island. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative shrink-0 rounded-[52px] p-[10px]"
      style={{
        width: 410,
        height: 864,
        background: "linear-gradient(160deg, #1c1a2e, #34304f)",
        boxShadow: "0 40px 90px -20px rgba(40,24,90,0.55), 0 0 0 2px rgba(255,255,255,0.06) inset",
      }}
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden rounded-[43px] bg-canvas"
        style={{ width: 390, height: 844 }}
      >
        {/* dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-[30px] w-[104px] -translate-x-1/2 rounded-full bg-black" />
        <StatusBar />
        {children}
      </div>
    </div>
  );
}

/** Standard conversation layout: sticky header, scrollable thread, composer/nav footer. */
export const ChatScreen = forwardRef<
  HTMLDivElement,
  { header: ReactNode; footer: ReactNode; children: ReactNode }
>(function ChatScreen({ header, footer, children }, ref) {
  return (
    <>
      {header}
      <div
        ref={ref}
        className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3.5"
        style={{ background: "linear-gradient(180deg,#f7f5fb,#f2eefb)" }}
      >
        {children}
      </div>
      {footer}
    </>
  );
});

/** A centered day/system chip inside the thread. */
export function DayChip({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center py-1">
      <span className="rounded-full bg-ink/[0.06] px-3 py-1 text-[11px] font-medium text-ink-3">
        {children}
      </span>
    </div>
  );
}
