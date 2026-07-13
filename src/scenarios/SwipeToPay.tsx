import { useState } from "react";
import { animate, motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, ChevronsRight } from "lucide-react";
import { ChatHeader, Composer, BottomNav } from "../ui/Chrome";
import { ChatScreen, DayChip } from "../ui/Phone";
import { Bubble, Row } from "../ui/Bubble";
import { Avatar } from "../ui/Avatar";
import { WalletChip } from "../ui/WalletChip";
import { money, spring, haptic } from "../lib/util";

const MAX = 224;
const THRESHOLD = 0.75;

export function SwipeToPay() {
  const x = useMotionValue(0);
  const [paid, setPaid] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [armed, setArmed] = useState(false);
  const [balance, setBalance] = useState(9800);

  const layerOpacity = useTransform(x, [0, 60], [0, 1]);
  const iconScale = useTransform(x, [0, MAX], [0.7, 1.25]);
  const iconOpacity = useTransform(x, [24, MAX * 0.6], [0, 1]);
  const labelX = useTransform(x, [0, MAX], [-8, 4]);

  const complete = () => {
    haptic();
    setBalance((b) => b - 800);
    animate(x, MAX, { type: "spring", stiffness: 500, damping: 34 });
    setTimeout(() => setPaid(true), 260);
  };

  const onDrag = () => {
    const p = x.get() / MAX;
    if (p >= THRESHOLD && !armed) {
      setArmed(true);
      setPulse(true);
      haptic();
      setTimeout(() => setPulse(false), 380);
    } else if (p < THRESHOLD && armed) {
      setArmed(false);
    }
  };

  const onEnd = () => {
    if (x.get() / MAX >= THRESHOLD) complete();
    else animate(x, 0, { type: "spring", stiffness: 380, damping: 32 });
  };

  return (
    <ChatScreen
      header={<ChatHeader name="Maria" subtitle="online" balance={<WalletChip balance={balance} />} />}
      footer={
        <>
          <Composer />
          <BottomNav active="pay" />
        </>
      }
    >
      <DayChip>Today</DayChip>

      <Bubble me time="10:12" status="read">
        Kumusta si Lola? How&apos;s grandma doing?
      </Bubble>

      <Row>
        <div className="flex w-full items-end gap-2">
          <Avatar name="Maria" size={26} />

          <div className="relative w-[80%]">
            {!paid ? (
              <>
                {/* purple pay layer behind the bubble */}
                <motion.div
                  style={{ opacity: layerOpacity }}
                  className="absolute inset-0 flex items-center justify-start overflow-hidden rounded-[18px] pl-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-viber to-viber-600" />
                  <motion.div
                    style={{ scale: iconScale, opacity: iconOpacity }}
                    className="relative z-10 flex items-center gap-2 text-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                      <ArrowRight size={18} />
                    </span>
                    <motion.span style={{ x: labelX }} className="text-[15px] font-bold tnum">
                      Pay {money(800)}
                    </motion.span>
                  </motion.div>
                </motion.div>

                {/* the draggable message itself */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: MAX }}
                  dragElastic={0.04}
                  style={{ x }}
                  onDrag={onDrag}
                  onDragEnd={onEnd}
                  className="relative touch-none"
                >
                  <div className="rounded-[18px] rounded-bl-[6px] bg-surface px-3.5 py-2.5 text-[14.5px] leading-[1.35] text-ink shadow-[0_2px_10px_rgba(23,21,50,0.08)]">
                    Can you send me {money(800)} for grandma&apos;s medicine? 🙏
                    <div className="mt-1 flex items-center gap-1 text-[10.5px] text-viber/70">
                      <ChevronsRight size={12} /> swipe to pay
                      <span className="ml-auto text-ink-3">10:14</span>
                    </div>
                  </div>
                  {/* threshold pulse */}
                  <AnimatePresence>
                    {pulse && (
                      <motion.div
                        initial={{ opacity: 0.5, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.12 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.38 }}
                        className="pointer-events-none absolute inset-0 rounded-[18px] ring-2 ring-viber"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : (
              <PaidCard />
            )}
          </div>
        </div>
      </Row>

      {paid && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Bubble me time="10:15" status="read">
            Sent na 💜 Take care of Lola for us
          </Bubble>
        </motion.div>
      )}
    </ChatScreen>
  );
}

function PaidCard() {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
      className="overflow-hidden rounded-[18px] rounded-bl-[6px] bg-gradient-to-br from-viber to-viber-600 px-4 py-4 text-white"
      style={{ boxShadow: "0 12px 26px rgba(115,96,242,0.34)" }}
    >
      <div className="flex items-center gap-3">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...spring, delay: 0.1 }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <motion.span
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            className="text-viber"
          >
            <Check size={24} strokeWidth={3} />
          </motion.span>
        </motion.span>
        <div>
          <div className="text-[13px] font-medium text-white/85">You sent Maria</div>
          <div className="text-[26px] font-extrabold leading-tight tnum">{money(800)}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2.5 text-[11.5px] text-white/85">
        <span>For grandma&apos;s medicine</span>
        <span className="font-semibold">Sent ✓✓</span>
      </div>
    </motion.div>
  );
}
