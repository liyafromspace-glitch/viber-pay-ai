import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScanLine, Sliders, Check } from "lucide-react";
import { ChatHeader, Composer, BottomNav } from "../ui/Chrome";
import { ChatScreen, DayChip } from "../ui/Phone";
import { Bubble, Row } from "../ui/Bubble";
import { Avatar } from "../ui/Avatar";
import { AICard } from "../ui/AICard";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { cx, money, spring, tween } from "../lib/util";

type Person = "Nikos" | "Elena" | "You" | "Maria";
const PEOPLE: Person[] = ["Nikos", "Elena", "You", "Maria"];
type Item = { id: string; who: Person; label: string; price: number };

const START: Item[] = [
  { id: "a", who: "Nikos", label: "Seafood platter", price: 34 },
  { id: "b", who: "Elena", label: "Wine", price: 12.5 },
  { id: "c", who: "You", label: "Salad & souvlaki", price: 21.9 },
  { id: "d", who: "Maria", label: "Parking credit", price: -6 },
];
const SHARED = 18; // bread, water, tip

type Phase = "idle" | "scanning" | "result" | "adjust";

export function ReceiptSplit() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [scanIdx, setScanIdx] = useState(-1);
  const [items, setItems] = useState<Item[]>(START);
  const [includeMe, setIncludeMe] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);

  const yourShare =
    items.filter((i) => i.who === "You").reduce((s, i) => s + i.price, 0) +
    (includeMe ? SHARED / 4 : 0);

  const startScan = () => {
    setPhase("scanning");
    setTimeout(() => scroller.current?.scrollTo({ top: 9999, behavior: "smooth" }), 80);
    [0, 1, 2, 3].forEach((i) => setTimeout(() => setScanIdx(i), 500 + i * 340));
    setTimeout(() => {
      setPhase("result");
      setTimeout(() => scroller.current?.scrollTo({ top: 9999, behavior: "smooth" }), 80);
    }, 2100);
  };

  return (
    <ChatScreen
      ref={scroller}
      header={<ChatHeader name="Dinner Crew" subtitle="5 members" />}
      footer={
        <>
          <Composer />
          <BottomNav active="pay" />
        </>
      }
    >
      <DayChip>Santorini · tonight</DayChip>

      <Row>
        <div className="flex items-end gap-2">
          <Avatar name="Nikos" size={26} />
          <div className="max-w-[78%]">
            <Bubble className="!p-1.5" time="21:40">
              <Receipt highlight={phase === "scanning" ? scanIdx : -1} scanning={phase === "scanning"} />
              <div className="px-1.5 pt-1 text-[13px] text-ink-2">Great dinner! Here&apos;s the receipt 🧾</div>
            </Bubble>

            {phase === "idle" && (
              <motion.button
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={startScan}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-viber-soft px-3.5 py-2 text-[13px] font-semibold text-viber active:scale-95"
              >
                <ScanLine size={15} /> Split receipt
              </motion.button>
            )}
          </div>
        </div>
      </Row>

      <AnimatePresence>
        {(phase === "scanning" || phase === "result" || phase === "adjust") && (
          <AICard key="split">
            {phase === "scanning" ? (
              <div className="flex items-center gap-2 py-1 text-[13.5px] font-medium text-viber-700">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <ScanLine size={16} />
                </motion.span>
                Reading receipt & matching who ordered what…
              </div>
            ) : (
              <>
                <h3 className="text-[15.5px] font-bold text-ink">Fair split · 4 people</h3>
                <div className="mt-2.5 space-y-1.5">
                  {phase === "result" ? (
                    <>
                      {items.map((it) => (
                        <LineRow key={it.id} who={it.who} label={it.label} price={it.price} />
                      ))}
                      <div className="flex items-center justify-between pt-0.5 text-[13px] text-ink-2">
                        <span>Shared · bread, water, tip</span>
                        <span className="tnum">{money(SHARED, "EUR")} / 4</span>
                      </div>
                    </>
                  ) : (
                    <AdjustRows
                      items={items}
                      setItems={setItems}
                      includeMe={includeMe}
                      setIncludeMe={setIncludeMe}
                    />
                  )}
                </div>

                <div
                  className="mt-3 flex items-center justify-between rounded-2xl bg-surface px-3.5 py-3"
                  style={{ boxShadow: "0 3px 12px rgba(115,96,242,0.1)" }}
                >
                  <span className="text-[13px] font-semibold text-ink-2">Your share</span>
                  <AnimatedNumber
                    value={yourShare}
                    currency="EUR"
                    className="text-[22px] font-extrabold text-viber tnum"
                  />
                </div>

                <div className="mt-3 flex gap-2.5">
                  <button className="flex-[1.3] rounded-2xl bg-viber py-3 text-[14px] font-semibold text-white active:scale-[0.98]">
                    Pay {money(yourShare, "EUR")}
                  </button>
                  <button
                    onClick={() => setPhase(phase === "adjust" ? "result" : "adjust")}
                    className={cx(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-3 text-[14px] font-semibold active:scale-[0.98]",
                      phase === "adjust" ? "bg-viber-soft text-viber" : "bg-surface text-viber"
                    )}
                  >
                    {phase === "adjust" ? <><Check size={15} /> Done</> : <><Sliders size={15} /> Adjust</>}
                  </button>
                </div>
              </>
            )}
          </AICard>
        )}
      </AnimatePresence>
    </ChatScreen>
  );
}

function LineRow({ who, label, price }: { who: Person; label: string; price: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={tween}
      className="flex items-center justify-between text-[13.5px]"
    >
      <span className="flex items-center gap-2">
        <Avatar name={who} size={20} />
        <span className="text-ink-2">
          <b className="font-semibold text-ink">{who}</b> · {label}
        </span>
      </span>
      <span className={cx("tnum font-semibold", price < 0 ? "text-good" : "text-ink")}>
        {money(price, "EUR")}
      </span>
    </motion.div>
  );
}

function AdjustRows({
  items,
  setItems,
  includeMe,
  setIncludeMe,
}: {
  items: Item[];
  setItems: (u: Item[]) => void;
  includeMe: boolean;
  setIncludeMe: (b: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.id} className="rounded-2xl bg-surface/70 p-2.5">
          <div className="mb-1.5 flex items-center justify-between text-[13px]">
            <span className="text-ink-2">{it.label}</span>
            <span className={cx("tnum font-semibold", it.price < 0 ? "text-good" : "text-ink")}>
              {money(it.price, "EUR")}
            </span>
          </div>
          <div className="flex gap-1">
            {PEOPLE.map((p) => (
              <button
                key={p}
                onClick={() => setItems(items.map((x) => (x.id === it.id ? { ...x, who: p } : x)))}
                className={cx(
                  "flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition-colors",
                  it.who === p ? "bg-viber text-white" : "bg-canvas text-ink-3"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={() => setIncludeMe(!includeMe)}
        className="flex w-full items-center justify-between rounded-2xl bg-surface/70 px-3.5 py-2.5 text-[13px]"
      >
        <span className="text-ink-2">Include me in shared items ({money(SHARED / 4, "EUR")})</span>
        <span
          className={cx(
            "flex h-6 w-10 items-center rounded-full px-0.5 transition-colors",
            includeMe ? "justify-end bg-viber" : "justify-start bg-ink/15"
          )}
        >
          <motion.span layout className="h-5 w-5 rounded-full bg-white shadow" />
        </span>
      </button>
    </div>
  );
}

/** CSS-drawn receipt with a vertical scan line and sequential item highlights. */
function Receipt({ highlight, scanning }: { highlight: number; scanning: boolean }) {
  const lines = [
    { label: "Seafood platter", price: "34.00" },
    { label: "House wine 0.5L", price: "12.50" },
    { label: "Salad & souvlaki", price: "21.90" },
    { label: "Bread · water · tip", price: "18.00" },
  ];
  return (
    <div className="relative overflow-hidden rounded-[14px] bg-[#fdfcf7] px-4 py-3.5" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)" }}>
      {scanning && (
        <motion.div
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 1.9, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-x-0 z-10 h-8"
          style={{ background: "linear-gradient(180deg, rgba(115,96,242,0) , rgba(115,96,242,0.35), rgba(115,96,242,0))" }}
        >
          <div className="absolute bottom-0 h-[2px] w-full bg-viber shadow-[0_0_10px_2px_rgba(115,96,242,0.7)]" />
        </motion.div>
      )}
      <div className="text-center">
        <div className="text-[12px] font-extrabold tracking-[0.15em] text-[#3a3730]">ΤΑΒΕΡΝΑ</div>
        <div className="text-[9px] tracking-wide text-[#9a968c]">OIA · SANTORINI</div>
      </div>
      <div className="my-2 border-t border-dashed border-[#d9d5c8]" />
      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <div
            key={l.label}
            className={cx(
              "flex items-center justify-between rounded px-1 text-[11px] transition-colors duration-200",
              highlight === i ? "bg-viber/15 font-semibold text-viber-700" : "text-[#5b574d]"
            )}
          >
            <span>{l.label}</span>
            <span className="tnum">€{l.price}</span>
          </div>
        ))}
      </div>
      <div className="my-2 border-t border-dashed border-[#d9d5c8]" />
      <div className="flex items-center justify-between text-[12px] font-bold text-[#3a3730]">
        <span>TOTAL</span>
        <span className="tnum">€86.40</span>
      </div>
    </div>
  );
}
