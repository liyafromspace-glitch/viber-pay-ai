import { createContext, useContext, useState, type ReactNode } from "react";
import { Check, X, Sparkles, Trash2 } from "lucide-react";
import { BottomSheet } from "./Sheet";

export type Signal = { label: string; used: boolean };

const DEFAULT_SIGNALS: Signal[] = [
  { label: "This chat — on-device, opt-in", used: true },
  { label: "This receipt photo", used: true },
  { label: "Other conversations", used: false },
  { label: "Photo library", used: false },
  { label: "Contacts outside this group", used: false },
];

type Ctx = {
  openWhyAI: (signals?: Signal[]) => void;
  open: boolean;
  signals: Signal[];
  close: () => void;
};
const AIContext = createContext<Ctx>({
  openWhyAI: () => {},
  open: false,
  signals: DEFAULT_SIGNALS,
  close: () => {},
});
export const useAI = () => useContext(AIContext);

export function AIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [signals, setSignals] = useState<Signal[]>(DEFAULT_SIGNALS);
  return (
    <AIContext.Provider
      value={{
        open,
        signals,
        close: () => setOpen(false),
        openWhyAI: (s) => {
          setSignals(s ?? DEFAULT_SIGNALS);
          setOpen(true);
        },
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

/** Rendered inside the PhoneFrame so it's clipped to the device. */
export function TransparencySheet() {
  const { open, signals, close } = useAI();
  return (
    <BottomSheet open={open} onClose={close} title="Why AI used this suggestion">
      <p className="mb-4 text-[13.5px] leading-relaxed text-ink-2">
        Processing stayed on your device. You decide what it can see — nothing leaves this
        conversation.
      </p>
      <div className="space-y-2">
        {signals.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl bg-canvas px-3.5 py-3 text-[14px] text-ink"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{
                background: s.used ? "var(--color-good-soft)" : "#f0eef5",
                color: s.used ? "var(--color-good)" : "var(--color-ink-3)",
              }}
            >
              {s.used ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
            </span>
            <span className="flex-1">{s.label}</span>
            <span
              className="text-[11px] font-bold uppercase tracking-wide"
              style={{ color: s.used ? "var(--color-good)" : "var(--color-ink-3)" }}
            >
              {s.used ? "Used" : "Not used"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-2.5">
        <button
          onClick={close}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-risk/25 bg-risk-soft py-3 text-[14px] font-semibold text-risk active:scale-[0.98]"
        >
          <Trash2 size={16} /> Delete reasoning
        </button>
        <button
          onClick={close}
          className="flex flex-[1.3] items-center justify-center gap-1.5 rounded-2xl bg-viber py-3 text-[14px] font-semibold text-white active:scale-[0.98]"
        >
          <Sparkles size={16} /> Looks right
        </button>
      </div>
    </BottomSheet>
  );
}
