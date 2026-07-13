import type { Transition } from "framer-motion";

/** Calm spring for meaningful transitions (message → card). */
export const spring: Transition = { type: "spring", stiffness: 380, damping: 32, mass: 0.9 };
export const softSpring: Transition = { type: "spring", stiffness: 260, damping: 28 };
/** Short tween for the everyday 180–350ms moves. */
export const tween: Transition = { duration: 0.24, ease: [0.22, 0.61, 0.36, 1] };
export const quick: Transition = { duration: 0.18, ease: [0.4, 0, 0.2, 1] };

/** Currency formatting for the two markets in play. */
export function money(value: number, currency: "PHP" | "EUR" = "PHP") {
  const symbol = currency === "PHP" ? "₱" : "€";
  const abs = Math.abs(value);
  const body = abs.toLocaleString("en-US", {
    minimumFractionDigits: currency === "EUR" ? 2 : abs % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${value < 0 ? "−" : ""}${symbol}${body}`;
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Deterministic avatar gradient from a name. */
const palettes = [
  ["#7C6CF5", "#B18CF0"],
  ["#F2994A", "#F2C94C"],
  ["#2D9CDB", "#56CCF2"],
  ["#EB5757", "#F2994A"],
  ["#27AE60", "#6FCF97"],
  ["#9B51E0", "#BB6BD9"],
];
export function avatarColors(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length] as [string, string];
}
export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

/** A tiny visual "haptic" — fires a callback the UI can react to. */
export function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate?.(12);
    } catch {
      /* ignore */
    }
  }
}
