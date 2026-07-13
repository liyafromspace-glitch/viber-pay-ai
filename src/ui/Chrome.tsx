import type { ReactNode } from "react";
import { ChevronLeft, Phone, Video, MessageCircle, Wallet, MoreHorizontal, Plus, Smile, Mic, Lock } from "lucide-react";
import { Avatar } from "./Avatar";
import { cx } from "../lib/util";

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? "text-white" : "text-ink";
  return (
    <div className={cx("flex h-[44px] shrink-0 items-center justify-between px-6 pt-1", color)}>
      <span className="text-[15px] font-semibold tracking-tight tnum">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal />
        <Wifi />
        <Battery />
      </div>
    </div>
  );
}
function Signal() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 4.5} y={9 - i * 3} width="3" height={3 + i * 3} rx="1" />
      ))}
    </svg>
  );
}
function Wifi() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
      <path d="M8.5 2C5.6 2 3 3.1 1 4.9l1.4 1.5C4 4.9 6.2 4 8.5 4s4.5.9 6.1 2.4L16 4.9C14 3.1 11.4 2 8.5 2Z" />
      <path d="M8.5 6.2c-1.6 0-3.1.6-4.2 1.6l1.5 1.5c.7-.7 1.7-1.1 2.7-1.1s2 .4 2.7 1.1l1.5-1.5c-1.1-1-2.6-1.6-4.2-1.6Z" />
      <circle cx="8.5" cy="10.4" r="1.4" />
    </svg>
  );
}
function Battery() {
  return (
    <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
      <rect x="2" y="2" width="16" height="9" rx="2" fill="currentColor" />
      <rect x="24" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function ChatHeader({
  name,
  subtitle,
  onBack,
  balance,
}: {
  name: string;
  subtitle?: string;
  onBack?: () => void;
  balance?: ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-black/[0.05] bg-surface/95 px-3 py-2.5 backdrop-blur">
      <button onClick={onBack} className="text-viber active:scale-90" aria-label="Back">
        <ChevronLeft size={26} />
      </button>
      <Avatar name={name} size={38} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15.5px] font-semibold leading-tight text-ink">{name}</div>
        <div className="truncate text-[11.5px] text-good">{subtitle ?? "online"}</div>
      </div>
      {balance}
      <button className="text-viber active:scale-90" aria-label="Call">
        <Phone size={21} />
      </button>
      <button className="text-viber active:scale-90" aria-label="Video">
        <Video size={22} />
      </button>
    </div>
  );
}

export function Composer({ disabled, disabledNote }: { disabled?: boolean; disabledNote?: string }) {
  return (
    <div className="shrink-0 border-t border-black/[0.05] bg-surface px-3 pt-2.5 pb-2">
      {disabled && disabledNote && (
        <div className="mb-2 flex items-center justify-center gap-1.5 text-[11.5px] font-medium text-risk">
          <Lock size={12} /> {disabledNote}
        </div>
      )}
      <div className={cx("flex items-center gap-2", disabled && "pointer-events-none opacity-45")}>
        <button className="text-ink-3" aria-label="Add">
          <Plus size={24} />
        </button>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-canvas px-3.5 py-2.5">
          <input
            disabled={disabled}
            placeholder="Message"
            className="flex-1 bg-transparent text-[14.5px] text-ink placeholder:text-ink-3 focus:outline-none"
          />
          <Smile size={20} className="text-ink-3" />
        </div>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-viber text-white active:scale-90"
          aria-label="Voice message"
        >
          <Mic size={18} />
        </button>
      </div>
    </div>
  );
}

const NAV = [
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "calls", label: "Calls", icon: Phone },
  { id: "pay", label: "Pay", icon: Wallet },
  { id: "more", label: "More", icon: MoreHorizontal },
] as const;

export function BottomNav({ active = "pay" }: { active?: string }) {
  return (
    <div className="flex shrink-0 items-stretch border-t border-black/[0.06] bg-surface pb-5 pt-1.5">
      {NAV.map(({ id, label, icon: Icon }) => {
        const on = id === active;
        return (
          <button
            key={id}
            className={cx(
              "flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[10.5px] font-medium",
              on ? "text-viber" : "text-ink-3"
            )}
          >
            <Icon size={22} strokeWidth={on ? 2.5 : 2} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
