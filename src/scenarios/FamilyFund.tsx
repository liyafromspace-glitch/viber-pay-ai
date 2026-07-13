import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeartHandshake, Pencil, Heart } from "lucide-react";
import { ChatHeader, Composer, BottomNav } from "../ui/Chrome";
import { ChatScreen, DayChip } from "../ui/Phone";
import { Bubble, Row } from "../ui/Bubble";
import { Avatar } from "../ui/Avatar";
import { AICard } from "../ui/AICard";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { money, spring, haptic } from "../lib/util";

const TARGET = 4000;
const MY_SHARE = 500;

export function FamilyFund() {
  const [collected, setCollected] = useState(2500);
  const [contributed, setContributed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const contributors = ["Tita Rosa", "Kuya Ramon", "Ate Divine"];
  const pct = Math.min(100, (collected / TARGET) * 100);

  const contribute = () => {
    haptic();
    setCollected((c) => c + MY_SHARE);
    setContributed(true);
    setTimeout(() => scroller.current?.scrollTo({ top: 9999, behavior: "smooth" }), 120);
  };

  return (
    <ChatScreen
      ref={scroller}
      header={<ChatHeader name="Family 💜" subtitle="8 members" />}
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
          <Bubble time="09:50">Let&apos;s all help for Lola&apos;s medicine this month 🙏</Bubble>
        </div>
      </Row>
      <Bubble me time="09:52" status="read">
        Kaya natin ito. I&apos;ll put in my share 💜
      </Bubble>

      <AICard whyAISignals={[
        { label: "This family group chat", used: true },
        { label: "Messages about the medicine cost", used: true },
        { label: "Other conversations", used: false },
        { label: "Contacts outside this group", used: false },
      ]}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-viber text-white">
            <HeartHandshake size={18} />
          </span>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-viber">Family Fund</div>
            <h3 className="text-[16px] font-bold leading-tight text-ink">Lola&apos;s Medicine</h3>
          </div>
        </div>

        <div className="mt-3.5 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium text-ink-3">Collected</div>
            <AnimatedNumber value={collected} className="text-[28px] font-extrabold text-ink tnum" />
          </div>
          <div className="text-right text-[12px] text-ink-2">
            <div className="tnum">of {money(TARGET)}</div>
            <div className="tnum text-ink-3">
              <AnimatedNumber value={TARGET - collected} className="" /> to go
            </div>
          </div>
        </div>

        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-viber-soft">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-viber to-[#b98ce8]"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ ...spring, stiffness: 160 }}
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {contributors.map((c) => (
              <Avatar key={c} name={c} size={26} ring />
            ))}
            <AnimatePresence>
              {contributed && (
                <motion.div
                  initial={{ scale: 0, x: -8 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={spring}
                >
                  <Avatar name="You" size={26} ring />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="text-[12px] text-ink-3">
            {contributors.length + (contributed ? 1 : 0)} contributors
          </span>
        </div>

        <div className="mt-3.5 flex gap-2.5">
          <button
            disabled={contributed}
            onClick={contribute}
            className="flex-[1.4] rounded-2xl bg-viber py-3 text-[14px] font-semibold text-white transition active:scale-[0.98] disabled:bg-good disabled:opacity-100"
          >
            {contributed ? "Sent 💜" : `Send my ${money(MY_SHARE)}`}
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-surface py-3 text-[14px] font-semibold text-viber active:scale-[0.98]">
            <Pencil size={14} /> Edit fund
          </button>
        </div>
      </AICard>

      <AnimatePresence>
        {contributed && (
          <>
            <motion.div
              key="reaction"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.15 }}
            >
              <Bubble me time="09:54" status="read" className="!bg-viber !text-white">
                <span className="flex items-center gap-1.5">
                  <Heart size={14} fill="white" /> Added my {money(MY_SHARE)} to Lola&apos;s fund
                </span>
              </Bubble>
            </motion.div>
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.5 }}
            >
              <Row>
                <div className="flex items-end gap-2">
                  <Avatar name="Ate Divine" size={26} />
                  <Bubble time="09:55">Salamat! 75% na tayo 🙏💜</Bubble>
                </div>
              </Row>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ChatScreen>
  );
}
