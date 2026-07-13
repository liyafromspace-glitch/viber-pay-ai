import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "../lib/util";

/**
 * Bottom sheet: springs up from the bottom, blurs the backdrop, and is
 * dismissable by dragging down. Constrained to the phone frame (absolute).
 */
export function BottomSheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-ink/25 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 max-h-[82%] overflow-hidden rounded-t-[24px] bg-surface"
            style={{ boxShadow: "0 -10px 40px rgba(23,21,50,0.18)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) onClose();
            }}
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="h-1 w-10 rounded-full bg-ink-3/40" />
            </div>
            {title && (
              <h3 className="px-5 pt-1 pb-2 text-[17px] font-bold tracking-[-0.01em] text-ink">{title}</h3>
            )}
            <div className="overflow-y-auto px-5 pb-10 no-scrollbar" style={{ maxHeight: "62vh" }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
