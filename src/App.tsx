import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Target, Swords, Scale, Activity, ShieldAlert } from "lucide-react";
import { AIProvider, TransparencySheet } from "./ui/ai";
import { PhoneFrame } from "./ui/Phone";
import { SCENARIOS, PILLARS, KEY_INTERACTIONS, type Pillar } from "./data/walkthrough";
import { cx, tween } from "./lib/util";

const PILLAR_COLOR: Record<Pillar, string> = {
  Activation: "#e0a92e",
  Moat: "#7360f2",
  Money: "#1f9d6b",
  Trust: "#e5484d",
};

const initialId = () => {
  const h = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
  return SCENARIOS.some((s) => s.id === h) ? h : SCENARIOS[0].id;
};

export default function App() {
  const [activeId, setActiveId] = useState(initialId);
  const [showStrategy, setShowStrategy] = useState(true);
  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];
  const Scene = active.component;

  const pick = (id: string) => {
    setActiveId(id);
    if (typeof window !== "undefined") window.location.hash = id;
  };

  useEffect(() => {
    const onHash = () => setActiveId(initialId());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <AIProvider>
      <div className="cs-stage flex min-h-screen w-full flex-wrap items-start justify-center gap-8 px-4 py-8 lg:px-10">
        {/* Persistent, always-clickable walkthrough panel */}
        <aside className="order-1 w-full max-w-[360px] shrink-0 sm:w-[340px] lg:sticky lg:top-8">
          <Walkthrough
            activeId={activeId}
            onPick={pick}
            showStrategy={showStrategy}
            onToggleStrategy={() => setShowStrategy((v) => !v)}
          />
        </aside>

        {/* Phone */}
        <div className="order-2 relative flex flex-col items-center">
          <div className="device-glow" />
          <div className="relative z-10">
          <PhoneFrame>
            {/*
              Keyed, direct render (no exit-wait AnimatePresence): switching scenarios
              remounts instantly, so the phone is never left blank mid-transition.
            */}
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tween}
              className="flex min-h-0 flex-1 flex-col"
            >
              <Scene />
            </motion.div>
            <TransparencySheet />
          </PhoneFrame>
          </div>

          <p className="relative z-10 mt-5 max-w-[380px] text-center text-[12px] leading-relaxed text-cs-dim">
            <span className="font-semibold text-cs-glow cs-glow-text">{active.title}</span> — {active.sub}
          </p>
        </div>

        {/* Strategy layer — its own column on the right */}
        {showStrategy && (
          <aside className="order-3 w-full max-w-[360px] shrink-0 sm:w-[320px] lg:sticky lg:top-8">
            <StrategyCard scenario={active} />
          </aside>
        )}
      </div>
    </AIProvider>
  );
}

function Walkthrough({
  activeId,
  onPick,
  showStrategy,
  onToggleStrategy,
}: {
  activeId: string;
  onPick: (id: string) => void;
  showStrategy: boolean;
  onToggleStrategy: () => void;
}) {

  return (
    <div className="cs-panel rounded-[20px] p-5">
      <div className="mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-viber text-white shadow-[0_0_20px_rgba(115,96,242,0.55)]">
            <Sparkles size={18} />
          </span>
          <div className="flex-1">
            <h1 className="text-[19px] font-light leading-none tracking-[-0.03em] text-cs-text">
              Viber Pay <span className="font-bold text-cs-glow cs-glow-text">AI</span>
            </h1>
            <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cs-dim">
              Payments that understand life
            </p>
          </div>
          <button
            onClick={onToggleStrategy}
            className={cx(
              "rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] transition-colors",
              showStrategy
                ? "bg-viber text-white shadow-[0_0_18px_rgba(115,96,242,0.5)]"
                : "border border-[rgba(167,139,255,0.25)] text-cs-dim hover:text-cs-glow"
            )}
            title="Toggle the research / strategy layer (shown on the right)"
          >
            Strategy
          </button>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-cs-muted">
          A walkthrough of the ten AI-native interactions, grouped by the three bets that win the
          Philippines launch — plus the Trust layer that carries them.
        </p>
      </div>

      <div className="space-y-4">
        {PILLARS.map((p) => {
          const items = SCENARIOS.filter((s) => s.pillar === p.key);
          if (!items.length) return null;
          const color = PILLAR_COLOR[p.key];
          return (
            <div key={p.key}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color }}>
                  {p.label}
                </h2>
                <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-cs-dim">· {p.blurb}</span>
              </div>
              <div className="space-y-1">
                {items.map((s) => {
                  const on = s.id === activeId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onPick(s.id)}
                      className={cx(
                        "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                        on ? "cs-active" : "hover:bg-white/[0.04]"
                      )}
                    >
                      <span
                        className={cx(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold",
                          on ? "bg-white/20 text-white" : "bg-white/[0.06] text-cs-lav"
                        )}
                      >
                        {s.feature}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cx("block text-[13.5px] font-medium", on ? "text-white" : "text-cs-text")}>
                          {s.title}
                        </span>
                        <span
                          className={cx(
                            "block truncate font-mono text-[9.5px] uppercase tracking-[0.06em]",
                            on ? "text-white/70" : "text-cs-dim"
                          )}
                        >
                          KPI · {s.kpi}
                        </span>
                      </span>
                      <ChevronRight
                        size={16}
                        className={cx("shrink-0", on ? "text-white/80" : "text-cs-dim")}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[rgba(167,139,255,0.12)] pt-4">
        <h3 className="mb-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-cs-dim">
          10 key interactions
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {KEY_INTERACTIONS.map((k, i) => (
            <span
              key={k}
              className="rounded-full border border-[rgba(167,139,255,0.16)] bg-[rgba(115,96,242,0.05)] px-2.5 py-1 font-mono text-[9.5px] tracking-[0.03em] text-cs-muted"
            >
              {i + 1}. {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The research-backed strategy layer for the active scenario: KPI · vs competitors · Legal. */
function StrategyCard({ scenario }: { scenario: (typeof SCENARIOS)[number] }) {
  const color = PILLAR_COLOR[scenario.pillar];
  const rows = [
    { icon: Target, label: "KPI", text: scenario.kpiFull, tint: "#4ade80" },
    { icon: Swords, label: "vs competitors", text: scenario.versus, tint: "#a78bff" },
    { icon: Scale, label: "Legal / constraint", text: scenario.legal, tint: "#e0a92e" },
  ];
  return (
    <motion.div
      key={scenario.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={tween}
      className="cs-panel mb-4 overflow-hidden rounded-[20px]"
    >
      <div className="flex items-center gap-2 px-3.5 pt-3">
        <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color }}>
          {scenario.pillar} · Strategy
        </span>
        <span className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.06em] text-cs-dim">
          {scenario.title}
        </span>
      </div>
      <div className="space-y-2.5 p-3.5">
        {rows.map(({ icon: Icon, label, text, tint }) => (
          <div key={label} className="flex gap-2.5">
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${tint}22`, color: tint }}
            >
              <Icon size={13} strokeWidth={2.4} />
            </span>
            <div className="min-w-0">
              <div className="font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] text-cs-dim">{label}</div>
              <div className="text-[12px] leading-[1.45] text-cs-muted">{text}</div>
            </div>
          </div>
        ))}

        {/* Usability metrics to track (HEART lens @ 190M scale) */}
        <div className="mt-1 border-t border-[rgba(167,139,255,0.12)] pt-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Activity size={13} strokeWidth={2.6} className="text-cs-glow" />
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] text-cs-dim">
              Metrics to track
            </span>
          </div>
          <ul className="space-y-1">
            {scenario.metrics.map((m) => (
              <li key={m} className="flex gap-2 text-[12px] leading-[1.4] text-cs-muted">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-cs-glow/70" />
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Paired guardrail */}
        <div className="flex items-start gap-2 rounded-xl border border-[rgba(248,113,113,0.22)] bg-[rgba(248,113,113,0.09)] px-2.5 py-2">
          <ShieldAlert size={13} strokeWidth={2.4} className="mt-[2px] shrink-0 text-cs-red" />
          <div className="min-w-0">
            <div className="font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] text-cs-red">
              Guardrail
            </div>
            <div className="text-[12px] leading-[1.4] text-cs-muted">{scenario.guardrail}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
