import { AnimatePresence, motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { money } from "../lib/util";

/** Small live wallet balance shown in the header; the number rolls when it changes. */
export function WalletChip({ balance, currency = "PHP" }: { balance: number; currency?: "PHP" | "EUR" }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-viber-soft px-2.5 py-1.5 text-viber-700">
      <Wallet size={13} />
      <div className="relative h-[15px] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={balance}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="block text-[12.5px] font-bold tnum"
          >
            {money(balance, currency)}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
