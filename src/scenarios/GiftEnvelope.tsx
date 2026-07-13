import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { ChatHeader, Composer, BottomNav } from "../ui/Chrome";
import { ChatScreen, DayChip } from "../ui/Phone";
import { Bubble, Row } from "../ui/Bubble";
import { Avatar } from "../ui/Avatar";
import { AICard } from "../ui/AICard";
import { WalletChip } from "../ui/WalletChip";
import { cx, money, spring, tween, haptic } from "../lib/util";

const AMOUNTS = [500, 1000, 2000];
type Phase = "idle" | "suggest" | "sending" | "delivered" | "received";

export function GiftEnvelope() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [amount, setAmount] = useState(1000);
  const [balance, setBalance] = useState(12450);
  const [pressed, setPressed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const openSuggestion = () => {
    setPhase("suggest");
    setTimeout(() => scroller.current?.scrollTo({ top: 9999, behavior: "smooth" }), 80);
  };

  const send = () => {
    setPressed(true);
    haptic();
    setBalance((b) => b - amount);
    setTimeout(() => {
      setPhase("sending");
      setTimeout(() => scroller.current?.scrollTo({ top: 9999, behavior: "smooth" }), 60);
    }, 220);
    setTimeout(() => setPhase("delivered"), 1500);
    setTimeout(() => setPhase("received"), 2700);
  };

  const sent = phase === "sending" || phase === "delivered" || phase === "received";

  return (
    <ChatScreen
      ref={scroller}
      header={
        <ChatHeader
          name="Tita Rosa"
          subtitle="online"
          balance={<WalletChip balance={balance} />}
        />
      }
      footer={
        <>
          <Composer />
          <BottomNav active="pay" />
        </>
      }
    >
      <DayChip>Today</DayChip>

      <Row>
        <div className="flex items-end gap-2">
          <Avatar name="Tita Rosa" size={26} />
          <div className="relative">
            <Bubble time="10:02">
              Miguel graduates on Saturday 🎓 Our inaanak, all grown up na!
            </Bubble>
            {/* sparkle affordance beside the message */}
            {phase === "idle" && (
              <motion.button
                onClick={openSuggestion}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...spring, delay: 0.4 }}
                whileTap={{ scale: 0.85 }}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface text-viber shadow-[0_3px_10px_rgba(115,96,242,0.35)]"
                aria-label="AI gift suggestion"
              >
                <motion.span
                  animate={{ scale: [1, 1.18, 1], opacity: [0.9, 1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                >
                  <Sparkles size={15} />
                </motion.span>
              </motion.button>
            )}
          </div>
        </div>
      </Row>

      <Bubble me time="10:05" status="read">
        Ay oo! Let&apos;s send him something 💜
      </Bubble>

      <AnimatePresence>
        {phase === "suggest" && (
          <AICard key="gift-card">
            <h3 className="text-[16px] font-bold tracking-[-0.01em] text-ink">
              A gift for Miguel&apos;s new chapter
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
              Suggested from local graduation gift customs for a Ninong / Ninang. You can adjust it.
            </p>

            <div className="mt-3 flex gap-2">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={cx(
                    "flex-1 rounded-2xl py-2.5 text-[14px] font-bold tnum transition-colors",
                    amount === a
                      ? "bg-viber text-white shadow-[0_4px_14px_rgba(115,96,242,0.35)]"
                      : "bg-surface text-ink-2"
                  )}
                >
                  {money(a)}
                </button>
              ))}
            </div>

            <motion.button
              onClick={send}
              animate={{ scale: pressed ? 0.96 : 1 }}
              transition={spring}
              className="mt-3 w-full rounded-2xl bg-viber py-3.5 text-[15px] font-semibold text-white active:brightness-95"
            >
              Send gift envelope · {money(amount)}
            </motion.button>
          </AICard>
        )}

        {sent && (
          <motion.div
            key="envelope"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
            className="ml-auto w-[70%]"
          >
            <Envelope amount={amount} phase={phase} />
            <StatusTrail phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>
    </ChatScreen>
  );
}

function Envelope({ amount, phase }: { amount: number; phase: Phase }) {
  const [open, setOpen] = useState(false);
  const canOpen = phase === "received";
  return (
    <div
      className="relative overflow-hidden rounded-[22px] px-5 pb-5 pt-6 text-center text-white"
      style={{ background: "linear-gradient(160deg,#e0403f,#c22b3f)", boxShadow: "0 14px 30px rgba(194,43,63,0.4)" }}
    >
      {/* envelope flap */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
        style={{
          background: "linear-gradient(180deg,rgba(255,255,255,0.14),transparent)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }}
      />
      {/* gold seal */}
      <motion.div
        animate={{ rotate: canOpen && !open ? [0, -6, 6, 0] : 0 }}
        transition={{ repeat: canOpen && !open ? Infinity : 0, duration: 2 }}
        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-[22px]"
        style={{ background: "radial-gradient(circle at 35% 30%,#ffe9a8,#e0a92e)", boxShadow: "0 4px 12px rgba(0,0,0,0.25)" }}
      >
        🧧
      </motion.div>

      <AnimatePresence mode="wait">
        {open ? (
          <motion.div key="opened" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-[13px] font-medium text-white/80">You received</div>
            <div className="text-[34px] font-extrabold leading-tight tnum">{money(amount)}</div>
            <div className="mt-1 text-[12px] text-white/80">Maligayang pagtatapos, Miguel! 🎓</div>
          </motion.div>
        ) : (
          <motion.div key="closed" exit={{ opacity: 0 }}>
            <div className="text-[13px] font-medium text-white/85">Gift envelope</div>
            <div className="text-[30px] font-extrabold tnum">{money(amount)}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        disabled={!canOpen}
        onClick={() => setOpen(true)}
        className={cx(
          "mt-4 w-full rounded-full py-2.5 text-[13.5px] font-bold transition-colors",
          open
            ? "bg-white/15 text-white/70"
            : canOpen
              ? "bg-white text-[#c22b3f]"
              : "bg-white/20 text-white/70"
        )}
      >
        {open ? "Opened 💜" : canOpen ? "Open envelope" : "Sealed"}
      </button>
    </div>
  );
}

function StatusTrail({ phase }: { phase: Phase }) {
  const steps = [
    { key: "sending", label: "Sending" },
    { key: "delivered", label: "Delivered" },
    { key: "received", label: "Received" },
  ] as const;
  const order = { idle: -1, suggest: -1, sending: 0, delivered: 1, received: 2 }[phase];
  return (
    <div className="mt-1.5 flex items-center justify-end gap-1.5 pr-1 text-[11px] text-ink-3">
      {steps.map((s, i) => {
        const done = i <= order;
        const active = i === order;
        return (
          <span key={s.key} className="flex items-center gap-1">
            <motion.span
              animate={{ scale: active ? [1, 1.35, 1] : 1 }}
              transition={{ duration: 0.5 }}
              className={cx(
                "flex h-3.5 w-3.5 items-center justify-center rounded-full",
                done ? "bg-good text-white" : "bg-ink/10"
              )}
            >
              {done && <Check size={9} strokeWidth={3} />}
            </motion.span>
            <span className={cx(active && "font-semibold text-ink-2")}>{s.label}</span>
            {i < 2 && <span className="text-ink-3/40">·</span>}
          </span>
        );
      })}
    </div>
  );
}
