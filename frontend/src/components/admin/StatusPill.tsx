import type { AppointmentStatus } from "@/lib/types";

const STYLES: Record<AppointmentStatus, { bg: string; fg: string; dot: string; label: string }> = {
  pending: { bg: "#FEF5E7", fg: "#7A4E08", dot: "#E6B432", label: "En attente" },
  confirmed: { bg: "#EAF3EB", fg: "#1E4F28", dot: "#2E6B3B", label: "Confirmé" },
  refused: { bg: "#FDF0EE", fg: "#9B2C2C", dot: "#B93A3A", label: "Refusé" },
};

export function StatusPill({ status }: { status: AppointmentStatus }) {
  const style = STYLES[status];
  return (
    <span
      data-testid={`status-pill-${status}`}
      style={{ backgroundColor: style.bg, color: style.fg }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
    >
      <span style={{ backgroundColor: style.dot }} className="h-1.5 w-1.5 rounded-full" aria-hidden="true" />
      {style.label}
    </span>
  );
}
