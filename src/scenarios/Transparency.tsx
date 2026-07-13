import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import { ChatHeader, Composer, BottomNav } from "../ui/Chrome";
import { ChatScreen, DayChip } from "../ui/Phone";
import { Bubble, Row } from "../ui/Bubble";
import { Avatar } from "../ui/Avatar";
import { AICard } from "../ui/AICard";
import { useAI } from "../ui/ai";
import { money } from "../lib/util";

/**
 * Feature #6 — AI transparency. Every AI card carries a "Why AI?" link; this
 * screen foregrounds it (the Germany / privacy-skeptic market feature).
 */
export function Transparency() {
  const { openWhyAI } = useAI();
  return (
    <ChatScreen
      header={<ChatHeader name="Miguel" subtitle="online" />}
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
          <Avatar name="Miguel" size={26} />
          <Bubble time="10:04">Thanks for lunch! I&apos;ll send you my half 🙏</Bubble>
        </div>
      </Row>

      <AICard>
        <h3 className="text-[15.5px] font-bold text-ink">Miguel owes you {money(240)}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
          Based on the lunch bill you shared in this chat. Send a friendly request?
        </p>
        <button className="mt-3 w-full rounded-2xl bg-viber py-3 text-[14px] font-semibold text-white active:scale-[0.98]">
          Request {money(240)}
        </button>
      </AICard>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-auto w-[88%] rounded-2xl border border-viber/15 bg-surface px-4 py-3.5"
      >
        <div className="flex items-center gap-2 text-viber">
          <ShieldCheck size={18} />
          <span className="text-[13.5px] font-bold">Private by design</span>
        </div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
          Every AI card carries a <b className="text-viber">Why AI?</b> link. Tap it to see exactly
          what was used — and delete the reasoning anytime.
        </p>
        <button
          onClick={() => openWhyAI()}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-viber-soft px-3.5 py-2 text-[13px] font-semibold text-viber active:scale-95"
        >
          <Sparkles size={14} /> Open transparency sheet
        </button>
      </motion.div>
    </ChatScreen>
  );
}
