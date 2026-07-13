import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Check, BadgeCheck, Send } from "lucide-react";
import { ChatHeader, Composer, BottomNav } from "../ui/Chrome";
import { ChatScreen, DayChip } from "../ui/Phone";
import { Bubble, Row } from "../ui/Bubble";
import { Avatar } from "../ui/Avatar";
import { AICard } from "../ui/AICard";
import { cx, money, spring } from "../lib/util";

const STAGES = ["Draft", "Sent", "Viewed", "Paid", "Settled"] as const;

export function Invoice() {
  const [stage, setStage] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = () => setTimeout(() => scroller.current?.scrollTo({ top: 9999, behavior: "smooth" }), 100);

  const sendInvoice = () => {
    setStage(1);
    scroll();
    setTimeout(() => setStage(2), 1500); // Viewed by client
  };
  const simulatePayment = () => {
    setStage(3);
    setTimeout(() => setStage(4), 1100);
  };

  return (
    <ChatScreen
      ref={scroller}
      header={<ChatHeader name="Kostas M." subtitle="Business account" />}
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
          <Avatar name="Kostas" size={26} />
          <Bubble time="14:02">Great, let&apos;s start the website redesign. Send me the deposit invoice?</Bubble>
        </div>
      </Row>
      <Bubble me time="14:03" status="read">
        On it — drafting it now 👇
      </Bubble>

      <AICard whyAISignals={[
        { label: "This business chat", used: true },
        { label: "Your agreed scope & rate", used: true },
        { label: "Personal conversations", used: false },
        { label: "Photo library", used: false },
      ]}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-viber text-white">
            <FileText size={17} />
          </span>
          <div className="flex-1">
            <h3 className="text-[15.5px] font-bold leading-tight text-ink">Website redesign — deposit</h3>
            <div className="text-[11.5px] text-ink-3">Invoice #2026-0142</div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-good-soft px-2 py-1 text-[10px] font-bold text-good">
            <BadgeCheck size={12} /> myDATA
          </span>
        </div>

        <div className="mt-3 space-y-1.5 rounded-2xl bg-surface px-3.5 py-3 text-[13.5px]">
          <div className="flex justify-between text-ink-2">
            <span>Deposit (40% of project)</span>
            <span className="tnum text-ink">{money(400, "EUR")}</span>
          </div>
          <div className="flex justify-between text-ink-2">
            <span>VAT 24% (ΦΠΑ)</span>
            <span className="tnum text-ink">{money(96, "EUR")}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-black/5 pt-1.5 text-[15px] font-bold text-ink">
            <span>Total</span>
            <span className="tnum">{money(496, "EUR")}</span>
          </div>
        </div>

        <Timeline stage={stage} />

        <div className="mt-3">
          {stage === 0 && (
            <button
              onClick={sendInvoice}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-viber py-3.5 text-[15px] font-semibold text-white active:scale-[0.98]"
            >
              <Send size={16} /> Send invoice in chat
            </button>
          )}
          {stage === 1 && (
            <div className="flex items-center justify-center gap-2 py-2 text-[13px] font-medium text-ink-3">
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                Delivered — waiting for Kostas to open…
              </motion.span>
            </div>
          )}
          {stage === 2 && (
            <button
              onClick={simulatePayment}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-viber py-3.5 text-[15px] font-semibold text-white active:scale-[0.98]"
            >
              Simulate payment
            </button>
          )}
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
              className={cx(
                "flex items-center justify-center gap-2 rounded-2xl py-3 text-[14px] font-semibold",
                stage === 4 ? "bg-good-soft text-good" : "bg-viber-soft text-viber"
              )}
            >
              {stage === 4 ? (
                <><BadgeCheck size={18} /> Settled to your IBAN · {money(496, "EUR")}</>
              ) : (
                <>Payment received — settling…</>
              )}
            </motion.div>
          )}
        </div>
      </AICard>

      <AnimatePresence>
        {stage >= 1 && (
          <motion.div key="inv-sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Bubble me time="14:05" status={stage >= 2 ? "read" : "delivered"} className="!bg-viber-soft">
              <span className="text-[12.5px] font-semibold text-viber">Invoice sent · {money(496, "EUR")}</span>
            </Bubble>
          </motion.div>
        )}
        {stage >= 3 && (
          <motion.div key="inv-paid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Row>
              <div className="flex items-end gap-2">
                <Avatar name="Kostas" size={26} />
                <Bubble time="14:11">Paid ✅ Excited to get started!</Bubble>
              </div>
            </Row>
          </motion.div>
        )}
      </AnimatePresence>
    </ChatScreen>
  );
}

function Timeline({ stage }: { stage: number }) {
  return (
    <div className="mt-4 flex items-start">
      {STAGES.map((label, i) => {
        const done = i < stage;
        const active = i === stage;
        const reached = i <= stage;
        return (
          <div key={label} className="relative flex flex-1 flex-col items-center">
            {i < STAGES.length - 1 && (
              <div className="absolute left-1/2 top-[11px] h-[2px] w-full bg-viber-soft">
                <motion.div
                  className="h-full bg-viber"
                  initial={false}
                  animate={{ width: i < stage ? "100%" : "0%" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>
            )}
            <motion.div
              animate={{ scale: active ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.5 }}
              className={cx(
                "z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 bg-surface",
                reached ? "border-viber" : "border-viber-soft"
              )}
            >
              {done ? (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-viber text-white">
                  <Check size={11} strokeWidth={3} />
                </span>
              ) : (
                <span className={cx("h-2 w-2 rounded-full", active ? "bg-viber" : "bg-viber-soft")} />
              )}
            </motion.div>
            <span className={cx("mt-1.5 text-[10px] font-medium", reached ? "text-viber" : "text-ink-3")}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
