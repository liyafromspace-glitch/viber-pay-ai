import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { money } from "../lib/util";

/** Smoothly counts from the previous value to the next, rendered as currency. */
export function AnimatedNumber({
  value,
  currency = "PHP",
  className,
  duration = 0.5,
}: {
  value: number;
  currency?: "PHP" | "EUR";
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return <span className={className}>{money(display, currency)}</span>;
}
