import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarClock, Check, Loader2, MapPin, MessageSquare, Palmtree, Phone, Plus, Save, Trash2, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { toast } from "sonner";
import type { AppointmentDto, AppointmentStatus, AvailabilityDto, BlockedPeriod, BookingSettings, ServiceDto } from "@/lib/types";

const FILTERS: { id: AppointmentStatus | "all"; label: string }[] = [
  { id: "pending", label: "En attente" },
  { id: "confirmed", label: "Confirmés" },
  { id: "refused", label: "Refusés" },
  { id: "all", label: "Tous" },
];

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending: "bg-terracotta/15 text-terracotta",
  confirmed: "bg-sage-light text-sage-deep",
  refused: "bg-destructive/10 text-destructive",
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  refused: "Refusé",
};

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const GAP_OPTIONS = [
  { value: 0, label: "Aucune pause" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 h" },
];

const inputCls =
  "w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-sage-deep";

function useBlockedPeriods() {
  return useQuery({ queryKey: ["blocked-periods"], queryFn: () => apiGet<BlockedPeriod[]>("/blocked-periods"), retry: false });
}

function isBlockedDay(d: Date, periods: BlockedPeriod[]): boolean {
  const s = format(d, "yyyy-MM-dd");
  return periods.some((p) => p.start_date <= s && s <= p.end_date);
}

function RescheduleDialog({
  appointment,
  services,
  onClose,
}: {
  appointment: AppointmentDto;
  services: ServiceDto[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const { data: settings } = useQuery({ queryKey: ["booking-settings"], queryFn: () => apiGet<BookingSettings>("/settings") });
  const { data: periods } = useBlockedPeriods();

  const duration = services.find((s) => s.id === appointment.service_id)?.duration_min ?? 60;
  const dateStr = date ? format(date, "yyyy-MM-dd") : null;

  const { data: availability, isFetching } = useQuery({
    queryKey: ["availability-admin", dateStr, appointment.id],
    queryFn: () =>
      apiGet<AvailabilityDto>(`/availability?date=${dateStr}&duration_min=${duration}&exclude_id=${appointment.id}`),
    enabled: dateStr !== null,
    retry: false,
  });

  const moveMutation = useMutation({
    mutationFn: () => apiPatch(`/appointments/${appointment.id}`, { date: dateStr, time: slot }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast.success("Rendez-vous déplacé");
      onClose();
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl" data-testid="reschedule-dialog">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Déplacer le rendez-vous</DialogTitle>
          <DialogDescription>
            {appointment.client_name} — actuellement le{" "}
            <span className="capitalize">{format(parseISO(appointment.date), "EEEE d MMMM", { locale: fr })}</span> à {appointment.time}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex justify-center rounded-2xl border border-border p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => { setDate(d); setSlot(null); }}
              locale={fr}
              disabled={(d) =>
                d < new Date(new Date().setHours(0, 0, 0, 0)) ||
                (settings ? !settings.open_days.includes((d.getDay() + 6) % 7) : false) ||
                isBlockedDay(d, periods ?? [])
              }
            />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-ink">
              {date ? (
                <span className="capitalize">{format(date, "EEEE d MMMM", { locale: fr })}</span>
              ) : (
                "Choisissez une nouvelle date"
              )}
            </p>
            {isFetching && (
              <p className="flex items-center gap-2 text-sm text-ink-muted">
                <Loader2 className="h-4 w-4 animate-spin" /> Recherche des créneaux…
              </p>
            )}
            {date && availability && availability.slots.length === 0 && (
              <p className="rounded-xl bg-sand/70 px-4 py-3 text-sm text-ink-muted">
                {availability.reason === "vacation"
                  ? "Période de congés — journée bloquée."
                  : availability.reason === "full"
                    ? "Journée complète."
                    : "Journée de fermeture hebdomadaire."}
              </p>
            )}
            {date && availability && availability.slots.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {availability.slots.map((s) => (
                  <button
                    key={s}
                    data-testid={`reschedule-slot-${s.replace(":", "h")}`}
                    onClick={() => setSlot(s)}
                    className={`rounded-xl border py-2.5 text-sm font-medium transition-all ${
                      slot === s ? "border-sage-deep bg-sage-deep text-white" : "border-border text-ink-muted hover:border-sage-soft hover:text-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <button
              data-testid="reschedule-confirm-button"
              onClick={() => moveMutation.mutate()}
              disabled={!dateStr || !slot || moveMutation.isPending}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-deep disabled:opacity-40"
            >
              {moveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
              Confirmer le nouveau créneau
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BlockedPeriodsPanel() {
  const queryClient = useQueryClient();
  const { data: periods } = useBlockedPeriods();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [label, setLabel] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["blocked-periods"] });

  const createMutation = useMutation({
    mutationFn: () => apiPost("/blocked-periods", { start_date: startDate, end_date: endDate, label }),
    onSuccess: () => {
      invalidate();
      toast.success("Période de fermeture ajoutée — la réservation est bloquée sur ces dates");
      setStartDate("");
      setEndDate("");
      setLabel("");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/blocked-periods/${id}`),
    onSuccess: () => {
      invalidate();
      toast.success("Période supprimée");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  return (
    <div data-testid="blocked-periods-panel" className="rounded-2xl border border-border bg-white p-6">
      <h2 className="flex items-center gap-2 font-serif text-lg text-ink">
        <Palmtree className="h-5 w-5 text-terracotta" />
        Congés & fermetures exceptionnelles
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Pendant ces périodes, le formulaire de réservation du site refuse automatiquement les demandes.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="blocked-start" className="mb-1.5 block text-sm font-medium text-ink">Du</label>
          <input id="blocked-start" data-testid="blocked-start-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="blocked-end" className="mb-1.5 block text-sm font-medium text-ink">Au (inclus)</label>
          <input id="blocked-end" data-testid="blocked-end-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="blocked-label" className="mb-1.5 block text-sm font-medium text-ink">Motif (facultatif)</label>
          <input id="blocked-label" data-testid="blocked-label-input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Vacances d'été" className={inputCls} />
        </div>
        <div className="flex items-end">
          <button
            data-testid="blocked-add-button"
            onClick={() => createMutation.mutate()}
            disabled={!startDate || !endDate || startDate > endDate || createMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-hover disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Bloquer
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {(periods ?? []).length === 0 && (
          <p className="rounded-xl bg-sand/50 px-4 py-3 text-sm text-ink-muted" data-testid="blocked-empty">
            Aucune période bloquée — la réservation suit vos horaires habituels.
          </p>
        )}
        {(periods ?? []).map((p) => (
          <div key={p.id} data-testid={`blocked-period-${p.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-sand/40 px-4 py-3">
            <p className="text-sm text-ink">
              <span className="font-medium capitalize">
                du {format(parseISO(p.start_date), "d MMM yyyy", { locale: fr })} au {format(parseISO(p.end_date), "d MMM yyyy", { locale: fr })}
              </span>
              {p.label && <span className="ml-2 text-ink-muted">— {p.label}</span>}
            </p>
            <button
              data-testid={`blocked-delete-${p.id}`}
              onClick={() => deleteMutation.mutate(p.id)}
              aria-label="Supprimer cette période"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingSettingsPanel() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({ queryKey: ["booking-settings"], queryFn: () => apiGet<BookingSettings>("/settings") });
  const [form, setForm] = useState<BookingSettings | null>(null);

  useEffect(() => {
    if (settings && form === null) setForm(settings);
  }, [settings, form]);

  const saveMutation = useMutation({
    mutationFn: (body: BookingSettings) => apiPut("/settings", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-settings"] });
      toast.success("Paramètres de réservation enregistrés");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  if (!form) return null;

  const toggleDay = (day: number) => {
    setForm((f) =>
      f === null
        ? f
        : { ...f, open_days: f.open_days.includes(day) ? f.open_days.filter((d) => d !== day) : [...f.open_days, day].sort() },
    );
  };

  return (
    <div data-testid="booking-settings-panel" className="rounded-2xl border border-border bg-white p-6">
      <h2 className="font-serif text-lg text-ink">Paramètres des rendez-vous</h2>
      <p className="mt-1 text-sm text-ink-muted">Ces règles s'appliquent immédiatement au formulaire de réservation du site.</p>

      <div className="mt-6 space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Journées d'ouverture</p>
          <div className="flex flex-wrap gap-2">
            {DAY_LABELS.map((label, day) => (
              <button
                key={label}
                data-testid={`settings-day-${day}`}
                onClick={() => toggleDay(day)}
                aria-pressed={form.open_days.includes(day)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  form.open_days.includes(day)
                    ? "border-sage-deep bg-sage-deep text-white"
                    : "border-border text-ink-muted hover:border-sage-soft"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-muted">Les journées non cochées sont fermées à la réservation.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="settings-start" className="mb-2 block text-sm font-medium text-ink">Début des consultations</label>
            <input id="settings-start" data-testid="settings-start-time" type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label htmlFor="settings-end" className="mb-2 block text-sm font-medium text-ink">Fin des consultations</label>
            <input id="settings-end" data-testid="settings-end-time" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className={inputCls} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="settings-gap" className="mb-2 block text-sm font-medium text-ink">Pause entre deux rendez-vous</label>
            <select
              id="settings-gap"
              data-testid="settings-gap-select"
              value={form.gap_minutes}
              onChange={(e) => setForm({ ...form, gap_minutes: Number(e.target.value) })}
              className="w-full rounded-xl border border-input bg-white px-4 py-2.5 text-sm outline-none focus:border-sage-deep"
            >
              {GAP_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="settings-max" className="mb-2 block text-sm font-medium text-ink">Rendez-vous maximum par jour</label>
            <input
              id="settings-max"
              data-testid="settings-max-input"
              type="number"
              min={1}
              max={20}
              value={form.max_per_day}
              onChange={(e) => setForm({ ...form, max_per_day: Math.max(1, Number(e.target.value) || 1) })}
              className={inputCls}
            />
          </div>
        </div>

        <button
          data-testid="settings-save-button"
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending || form.open_days.length === 0}
          className="flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-deep disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<AppointmentStatus | "all">("pending");
  const [rescheduling, setRescheduling] = useState<AppointmentDto | null>(null);
  const { data: appointments } = useQuery({
    queryKey: ["admin-appointments", "all"],
    queryFn: () => apiGet<AppointmentDto[]>("/appointments"),
  });
  const { data: services } = useQuery({ queryKey: ["admin-services"], queryFn: () => apiGet<ServiceDto[]>("/services") });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiPatch(`/appointments/${id}`, { status }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast.success(vars.status === "confirmed" ? "Rendez-vous confirmé" : "Rendez-vous refusé");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const all = appointments ?? [];
  const counts = {
    pending: all.filter((a) => a.status === "pending").length,
    confirmed: all.filter((a) => a.status === "confirmed").length,
    refused: all.filter((a) => a.status === "refused").length,
    all: all.length,
  };
  const visible = filter === "all" ? all : all.filter((a) => a.status === filter);

  return (
    <div data-testid="admin-appointments-page">
      <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">Rendez-vous</h1>
      <p className="mt-2 text-sm text-ink-muted">Confirmez, refusez ou déplacez les demandes reçues depuis le site.</p>

      <div className="mt-6 flex flex-wrap gap-2" data-testid="appointments-filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            data-testid={`filter-${f.id}`}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.id ? "border-forest bg-forest text-cream" : "border-border bg-white text-ink-muted hover:border-sage-soft"
            }`}
          >
            {f.label} · {counts[f.id]}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-border bg-white px-6 py-10 text-center text-sm text-ink-muted">
            Aucun rendez-vous dans cette catégorie.
          </p>
        )}
        {visible.map((a) => (
          <article key={a.id} data-testid={`appointment-card-${a.id}`} className="rounded-2xl border border-border bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-serif text-lg text-ink">{a.client_name}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[a.status]}`}>
                    {STATUS_LABELS[a.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-sage-deep">
                  {a.service_name} · <span className="capitalize">{format(parseISO(a.date), "EEEE d MMMM yyyy", { locale: fr })}</span> à {a.time}
                </p>
                <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
                  <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {a.phone}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {a.address}</p>
                  {a.message && <p className="flex items-start gap-2"><MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {a.message}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {a.status !== "confirmed" && (
                  <button
                    data-testid={`confirm-${a.id}`}
                    onClick={() => statusMutation.mutate({ id: a.id, status: "confirmed" })}
                    className="flex items-center gap-1.5 rounded-full bg-sage-deep px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-forest"
                  >
                    <Check className="h-3.5 w-3.5" /> Confirmer
                  </button>
                )}
                {a.status !== "refused" && (
                  <button
                    data-testid={`reschedule-${a.id}`}
                    onClick={() => setRescheduling(a)}
                    className="flex items-center gap-1.5 rounded-full border border-sage-deep/30 px-4 py-2 text-xs font-medium text-sage-deep transition-colors hover:bg-sage-light"
                  >
                    <CalendarClock className="h-3.5 w-3.5" /> Déplacer
                  </button>
                )}
                {a.status !== "refused" && (
                  <button
                    data-testid={`refuse-${a.id}`}
                    onClick={() => statusMutation.mutate({ id: a.id, status: "refused" })}
                    className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" /> Refuser
                  </button>
                )}
                {a.status !== "pending" && (
                  <button
                    data-testid={`repending-${a.id}`}
                    onClick={() => statusMutation.mutate({ id: a.id, status: "pending" })}
                    className="rounded-full border border-border px-4 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-sage-soft hover:text-ink"
                  >
                    Remettre en attente
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 space-y-6">
        <BookingSettingsPanel />
        <BlockedPeriodsPanel />
      </div>

      {rescheduling && (
        <RescheduleDialog appointment={rescheduling} services={services ?? []} onClose={() => setRescheduling(null)} />
      )}
    </div>
  );
}
