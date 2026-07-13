import { avatarColors, initials, cx } from "../lib/util";

export function Avatar({
  name,
  size = 36,
  ring = false,
  className,
}: {
  name: string;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  const [a, b] = avatarColors(name);
  return (
    <div
      className={cx("flex shrink-0 items-center justify-center rounded-full font-bold text-white", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${a}, ${b})`,
        boxShadow: ring ? "0 0 0 3px rgba(255,255,255,0.9), 0 2px 8px rgba(23,21,50,0.14)" : undefined,
      }}
      aria-hidden
    >
      {initials(name).toUpperCase()}
    </div>
  );
}
