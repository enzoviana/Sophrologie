const TINTS = [
  { bg: "#E8EFE8", fg: "#243E2B" },
  { bg: "#E9F1F7", fg: "#2B618F" },
  { bg: "#FEF7E6", fg: "#7A5E1E" },
];

interface AvatarProps {
  name: string;
  className?: string;
}

export function Avatar({ name, className }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
  const tint = TINTS[name.length % TINTS.length];
  return (
    <span
      style={{ backgroundColor: tint.bg, color: tint.fg }}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${className ?? "h-10 w-10 text-sm"}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
