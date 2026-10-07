import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MapPin, Phone } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { AppointmentDto } from "@/lib/types";

type ViewMode = "day" | "week" | "month";

const VIEW_LABELS: { id: ViewMode; label: string }[] = [
  { id: "day", label: "Jour" },
  { id: "week", label: "Semaine" },
  { id: "month", label: "Mois" },
];

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(new Date());
  const { data: appointments } = useQuery({
    queryKey: ["admin-appointments", "all"],
    queryFn: () => apiGet<AppointmentDto[]>("/appointments"),
  });

  const byDate = useMemo(() => {
    const map = new Map<string, AppointmentDto[]>();
    for (const a of appointments ?? []) {
      if (a.status === "refused") continue;
      const list = map.get(a.date) ?? [];
      list.push(a);
      map.set(a.date, list);
    }
    return map;
  }, [appointments]);

  const navigate = (dir: -1 | 1) => {
    setCursor((c) => (view === "month" ? addMonths(c, dir) : view === "week" ? addWeeks(c, dir) : addDays(c, dir)));
  };

  const title =
    view === "month"
      ? format(cursor, "MMMM yyyy", { locale: fr })
      : view === "week"
        ? `Semaine du ${format(startOfWeek(cursor, { weekStartsOn: 1 }), "d MMMM", { locale: fr })}`
        : format(cursor, "EEEE d MMMM yyyy", { locale: fr });

  const monthStart = startOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthCells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const weekStart = startOfWeek(cursor, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayKey = format(cursor, "yyyy-MM-dd");
  const dayAppointments = byDate.get(dayKey) ?? [];

  return (
    <div data-testid="admin-calendar-page">
      <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">Calendrier</h1>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button data-testid="calendar-prev" onClick={() => navigate(-1)} aria-label="Précédent" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:border-sage-soft">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button data-testid="calendar-today" onClick={() => setCursor(new Date())} className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-sage-soft">
            Aujourd'hui
          </button>
          <button data-testid="calendar-next" onClick={() => navigate(1)} aria-label="Suivant" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:border-sage-soft">
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-3 font-serif text-lg capitalize text-ink">{title}</h2>
        </div>
        <div className="flex rounded-full border border-border bg-white p-1" data-testid="calendar-view-switch">
          {VIEW_LABELS.map((v) => (
            <button
              key={v.id}
              data-testid={`view-${v.id}`}
              onClick={() => setView(v.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${view === v.id ? "bg-forest text-cream" : "text-ink-muted hover:text-ink"}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === "month" && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white" data-testid="calendar-month-view">
          <div className="grid grid-cols-7 border-b border-border bg-sand/40">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-ink-muted">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const items = byDate.get(key) ?? [];
              return (
                <button
                  key={key}
                  data-testid={`calendar-day-${key}`}
                  onClick={() => { setCursor(day); setView("day"); }}
                  className={`min-h-24 border-b border-r border-border p-2 text-left align-top transition-colors hover:bg-sage-light/50 ${
                    isSameMonth(day, cursor) ? "" : "bg-sand/30 text-ink-muted/50"
                  }`}
                >
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${isToday(day) ? "bg-terracotta font-semibold text-white" : ""}`}>
                    {format(day, "d")}
                  </span>
                  <span className="mt-1 block space-y-1">
                    {items.slice(0, 3).map((a) => (
                      <span
                        key={a.id}
                        className={`block truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium ${
                          a.status === "confirmed" ? "bg-sage-light text-forest" : "bg-terracotta/15 text-terracotta"
                        }`}
                      >
                        {a.time} · {a.client_name}
                      </span>
                    ))}
                    {items.length > 3 && <span className="block px-1.5 text-[11px] text-ink-muted">+{items.length - 3} autre(s)</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7" data-testid="calendar-week-view">
          {weekDays.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const items = byDate.get(key) ?? [];
            return (
              <div key={key} className={`rounded-2xl border bg-white p-3 ${isToday(day) ? "border-terracotta" : "border-border"}`}>
                <p className="text-center">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">{format(day, "EEE", { locale: fr })}</span>
                  <span className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full font-serif text-lg ${isToday(day) ? "bg-terracotta text-white" : "text-ink"}`}>
                    {format(day, "d")}
                  </span>
                </p>
                <div className="mt-3 space-y-2">
                  {items.length === 0 && <p className="py-3 text-center text-xs text-ink-muted/60">—</p>}
                  {items.map((a) => (
                    <button
                      key={a.id}
                      data-testid={`week-appointment-${a.id}`}
                      onClick={() => { setCursor(day); setView("day"); }}
                      className={`w-full rounded-xl px-2.5 py-2 text-left text-xs ${
                        a.status === "confirmed" ? "bg-sage-light text-forest" : "bg-terracotta/15 text-terracotta"
                      }`}
                    >
                      <span className="block font-semibold">{a.time}</span>
                      <span className="block truncate">{a.client_name}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "day" && (
        <div className="mt-6 rounded-2xl border border-border bg-white" data-testid="calendar-day-view">
          {dayAppointments.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-ink-muted">Aucun rendez-vous ce jour-là.</p>
          ) : (
            <ul className="divide-y divide-border">
              {dayAppointments.map((a) => (
                <li key={a.id} data-testid={`day-appointment-${a.id}`} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center">
                  <span className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl font-semibold ${
                    a.status === "confirmed" ? "bg-sage-light text-forest" : "bg-terracotta/15 text-terracotta"
                  }`}>
                    <span className="text-sm leading-none">{a.time}</span>
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-ink">{a.client_name} — {a.service_name}</p>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                      <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{a.phone}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{a.address}</span>
                    </p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    a.status === "confirmed" ? "bg-sage-light text-sage-deep" : "bg-terracotta/15 text-terracotta"
                  }`}>
                    {a.status === "confirmed" ? "Confirmé" : "En attente"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-5 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-terracotta/60" /> En attente</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sage-deep" /> Confirmé</span>
      </div>
    </div>
  );
}
