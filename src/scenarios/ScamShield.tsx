import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Ban, PhoneCall, HelpCircle } from "lucide-react";
import { ChatHeader, Composer, BottomNav } from "../ui/Chrome";
import { ChatScreen, DayChip } from "../ui/Phone";
import { Bubble, Row } from "../ui/Bubble";
import { Avatar } from "../ui/Avatar";
import { AICard } from "../ui/AICard";
import { BottomSheet } from "../ui/Sheet";
import { money, spring } from "../lib/util";

const REASONS = [
  "New number claiming to be a saved contact",
  "Urgency and “don’t call” language",
  "Payment requested in the first message",
];

export function ScamShield() {
  const [warn, setWarn] = useState(false);
  const [why, setWhy] = useState(false);
  const [resolved, setResolved] = useState<null | "blocked" | "verified">(null);

  useEffect(() => {
    const t = setTimeout(() => setWarn(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <ChatScreen
      header={<ChatHeader name="+63 912 345 6789" subtitle="not in your contacts" />}
      footer={
        <>
          <Composer
            disabled={warn && !resolved}
            disabledNote="Payments paused until you verify this contact"
          />
          <BottomNav active="pay" />
        </>
      }
    >
      <DayChip>Today</DayChip>

      <Row>
        <div className="flex items-end gap-2">
          <Avatar name="Unknown" size={26} />
          <Bubble time="10:18" className="max-w-[86%]">
            <Flag>Mom here</Flag>, <Flag>new number</Flag>. <Flag>Send {money(8000)} now</Flag>. I&apos;ll
            explain later. <Flag>Don&apos;t call.</Flag>
          </Bubble>
        </div>
      </Row>

      <AnimatePresence>
        {warn && !resolved && (
          <AICard
            key="scam"
            tone="risk"
            showWhy={false}
            whyAISignals={[
              { label: "This chat — on-device", used: true },
              { label: "Your saved contacts (number match)", used: true },
              { label: "Message content & timing", used: true },
              { label: "Photo library", used: false },
              { label: "Other conversations", used: false },
            ]}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-risk text-white">
                <ShieldAlert size={18} />
              </span>
              <div>
                <h3 className="text-[15.5px] font-bold leading-tight text-risk">
                  This looks like a family impersonation scam
                </h3>
                <p className="mt-0.5 text-[12.5px] text-ink-2">
                  Someone is posing as a saved contact to rush a payment.
                </p>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5">
              {REASONS.map((r, i) => (
                <motion.li
                  key={r}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                  className="flex items-start gap-2 text-[13px] text-ink-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-risk" />
                  {r}
                </motion.li>
              ))}
            </ul>

            <div className="mt-3.5 flex items-stretch gap-2.5">
              <button
                onClick={() => setResolved("blocked")}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-risk px-2 text-[13px] font-semibold leading-tight text-white active:scale-[0.98]"
              >
                <Ban size={15} className="shrink-0" />
                <span>Block &amp; report</span>
              </button>
              <button
                onClick={() => setResolved("verified")}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-surface px-2 text-center text-[13px] font-semibold leading-tight text-ink active:scale-[0.98]"
              >
                <PhoneCall size={15} className="shrink-0" />
                <span>Verify with real&nbsp;Mom</span>
              </button>
            </div>

            <button
              onClick={() => setWhy(true)}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-risk/80 underline-offset-2 hover:underline"
            >
              <HelpCircle size={13} /> Why was this flagged?
            </button>
          </AICard>
        )}

        {resolved && (
          <motion.div
            key="resolved"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="mx-auto flex w-[86%] items-center gap-2.5 rounded-2xl bg-good-soft px-4 py-3 text-good"
          >
            <ShieldCheck size={20} />
            <span className="text-[13px] font-semibold">
              {resolved === "blocked"
                ? "Number blocked & reported. No money left your wallet."
                : "Chat with your real Mom opened — payment stays paused here."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomSheet open={why} onClose={() => setWhy(false)} title="Why was this flagged?">
        <p className="mb-4 text-[13.5px] leading-relaxed text-ink-2">
          Viber compared this message against patterns of known impersonation scams — all on your
          device. Here is what stood out, in plain language:
        </p>
        <div className="space-y-3">
          {[
            ["A brand-new number", "It claims to be “Mom,” but the number was never saved in your contacts and messaged you for the first time today."],
            ["Pressure to act fast", "“Send now” plus “I’ll explain later” is designed to stop you from thinking it through."],
            ["“Don’t call” instruction", "Real family are happy to hear your voice. Scammers block the one check that would expose them."],
            ["Money in the first message", "A genuine reconnection rarely opens with a payment request for a large amount."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-canvas px-4 py-3">
              <div className="text-[14px] font-semibold text-ink">{t}</div>
              <div className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">{d}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
          You are always in control — Viber never blocks a contact for you, it only pauses the
          payment and asks you to check.
        </p>
      </BottomSheet>
    </ChatScreen>
  );
}

/** Suspicious phrase with a soft red underline. */
function Flag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-risk"
      style={{ textDecoration: "underline wavy", textDecorationColor: "rgba(229,72,77,0.55)", textUnderlineOffset: "3px" }}
    >
      {children}
    </span>
  );
}
