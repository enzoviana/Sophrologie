import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarCheck, Check, ChevronLeft, ChevronRight, Clock, Loader2, MapPin, PartyPopper, User } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { SERVICES } from "./data";
import { apiGet, apiPost } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { useSiteContent } from "@/lib/content";
import { EditableText } from "@/components/edit/EditableText";
import { formatDuration, formatPrice, type AvailabilityDto, type BlockedPeriod, type BookingSettings, type ServiceDto } from "@/lib/types";

const STEP_LABELS = ["Prestation", "Date & heure", "Coordonnées"];

const STATIC_SERVICES: ServiceDto[] = SERVICES.map((s) => ({
  id: s.id,
  name: s.name,
  description: s.description,
  duration_min: s.id === "enfants-ados" ? 45 : 60,
  price: parseInt(s.price, 10) || 0,
  price_note: s.priceNote ?? (s.price === "Sur devis" ? "Sur devis" : null),
  features: s.features,
  highlight: !!s.highlight,
  active: true,
}));

const DEFAULT_SETTINGS: BookingSettings = { open_days: [0, 1, 2, 3, 4, 5], start_time: "09:00", end_time: "19:00", gap_minutes: 15, max_per_day: 5 };

interface BookingProps {
  selectedService: string | null;
  onSelectService: (id: string | null) => void;
}

export function Booking({ selectedService, onSelectService }: BookingProps) {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: liveServices } = useQuery({
    queryKey: ["public-services"],
    queryFn: () => apiGet<ServiceDto[]>("/services"),
    retry: false,
    staleTime: 60_000,
  });
  const services = (liveServices ? liveServices.filter((s) => s.active) : STATIC_SERVICES).filter((s) => s.price > 0);

  const { data: liveSettings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: () => apiGet<BookingSettings>("/settings"),
    retry: false,
    staleTime: 60_000,
  });
  const settings = liveSettings ?? DEFAULT_SETTINGS;
  const content = useSiteContent();

  const { data: blockedPeriods } = useQuery({
    queryKey: ["blocked-periods"],
    queryFn: () => apiGet<BlockedPeriod[]>("/blocked-periods"),
    retry: false,
    staleTime: 60_000,
  });
  const isBlockedDay = (d: Date) => {
    const s = format(d, "yyyy-MM-dd");
    return (blockedPeriods ?? []).some((p) => p.start_date <= s && s <= p.end_date);
  };

  const service = services.find((s) => s.id === selectedService) ?? null;
  const dateStr = date ? format(date, "yyyy-MM-dd") : null;

  const { data: availability, isFetching: slotsLoading } = useQuery({
    queryKey: ["availability", dateStr, service?.id],
    queryFn: () => apiGet<AvailabilityDto>(`/availability?date=${dateStr}&duration_min=${service?.duration_min ?? 60}`),
    enabled: dateStr !== null && service !== null,
    retry: false,
  });

  const canNext = step === 0 ? service !== null : step === 1 ? date !== undefined && slot !== null : false;
  const canConfirm = name.trim() !== "" && phone.trim() !== "" && address.trim() !== "";

  const reset = () => {
    onSelectService(null);
    setDate(undefined);
    setSlot(null);
    setName("");
    setPhone("");
    setAddress("");
    setMessage("");
    setStep(0);
    setConfirmed(false);
  };

  const confirm = async () => {
    if (!service || !dateStr || !slot) return;
    setSubmitting(true);
    try {
      await apiPost("/appointments", {
        service_id: service.id,
        service_name: service.name,
        date: dateStr,
        time: slot,
        client_name: name,
        phone,
        address,
        message,
      });
      setConfirmed(true);
      toast.success("Demande de rendez-vous envoyée");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reservation" data-testid="booking-section" className="bg-sand/50 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">Prise de rendez-vous</p>
          <h2 className="mt-3 font-serif text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
            <EditableText field="booking_title" value={content.booking_title} />
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-muted">
            <EditableText field="booking_subtitle" value={content.booking_subtitle} multiline />
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 rounded-3xl border border-border bg-white p-6 shadow-xl shadow-sage-deep/10 sm:p-10">
            {confirmed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="py-6 text-center"
                data-testid="booking-success"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-light">
                  <PartyPopper className="h-8 w-8 text-sage-deep" />
                </span>
                <h3 className="mt-6 font-serif text-2xl text-ink">Demande envoyée avec succès</h3>
                <p className="mx-auto mt-3 max-w-md text-ink-muted">
                  {name}, votre demande pour une <strong>{service?.name}</strong>
                  {date && (
                    <>
                      {" "}le <strong className="capitalize">{format(date, "EEEE d MMMM", { locale: fr })}</strong> à{" "}
                      <strong>{slot}</strong>
                    </>
                  )}{" "}
                  a bien été transmise. Katia la confirme personnellement : vous recevrez sa réponse par téléphone
                  sous 24 h.
                </p>
                <button
                  data-testid="booking-reset-button"
                  onClick={reset}
                  className="mt-8 rounded-full border border-sage-deep/30 px-6 py-3 text-sm font-medium text-sage-deep transition-colors duration-300 hover:bg-sage-light"
                >
                  Faire une nouvelle demande
                </button>
              </motion.div>
            ) : (
              <>
                <ol className="mb-10 flex items-center justify-center gap-2 sm:gap-4" data-testid="booking-steps">
                  {STEP_LABELS.map((label, i) => (
                    <li key={label} className="flex items-center gap-2 sm:gap-4">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300 ${
                          i < step
                            ? "border-sage-deep bg-sage-deep text-white"
                            : i === step
                              ? "border-terracotta bg-terracotta text-white"
                              : "border-border text-ink-muted"
                        }`}
                      >
                        {i < step ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      <span className={`hidden text-sm sm:block ${i === step ? "font-medium text-ink" : "text-ink-muted"}`}>
                        {label}
                      </span>
                      {i < STEP_LABELS.length - 1 && <span className="h-px w-6 bg-border sm:w-10" aria-hidden="true" />}
                    </li>
                  ))}
                </ol>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    {step === 0 && (
                      <div className="grid gap-4 sm:grid-cols-2" data-testid="booking-step-service">
                        {services.map((s) => (
                          <button
                            key={s.id}
                            data-testid={`booking-service-${s.id}`}
                            onClick={() => { onSelectService(s.id); setDate(undefined); setSlot(null); }}
                            className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                              selectedService === s.id
                                ? "border-sage-deep bg-sage-light shadow-md shadow-sage-deep/10"
                                : "border-border hover:border-sage-soft hover:bg-cream"
                            }`}
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="font-serif text-lg text-ink">{s.name}</span>
                              <span className="shrink-0 font-serif text-lg text-sage-deep">{formatPrice(s.price, s.price_note)}</span>
                            </span>
                            <span className="mt-1 block text-sm text-ink-muted">
                              {formatDuration(s.duration_min)} · à domicile
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {step === 1 && (
                      <div className="grid gap-8 md:grid-cols-2" data-testid="booking-step-datetime">
                        <div className="flex justify-center rounded-2xl border border-border p-3">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => { setDate(d); setSlot(null); }}
                            locale={fr}
                            disabled={(d) =>
                              d < new Date(new Date().setHours(0, 0, 0, 0)) ||
                              !settings.open_days.includes((d.getDay() + 6) % 7) ||
                              isBlockedDay(d)
                            }
                          />
                        </div>
                        <div>
                          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
                            <Clock className="h-4 w-4 text-sage-deep" />
                            {date ? (
                              <span className="capitalize">{format(date, "EEEE d MMMM", { locale: fr })}</span>
                            ) : (
                              "Sélectionnez d'abord une date"
                            )}
                          </p>
                          {date && slotsLoading && (
                            <p className="flex items-center gap-2 text-sm text-ink-muted">
                              <Loader2 className="h-4 w-4 animate-spin" /> Recherche des créneaux…
                            </p>
                          )}
                          {date && availability && availability.slots.length === 0 && (
                            <p className="rounded-xl bg-sand/70 px-4 py-3 text-sm text-ink-muted" data-testid="booking-no-slots">
                              {availability.reason === "vacation"
                                ? "Katia est en congé sur cette période — choisissez une autre date."
                                : availability.closed
                                  ? "Katia ne consulte pas ce jour-là. Choisissez une autre date."
                                  : "Cette journée est complète. Choisissez une autre date."}
                            </p>
                          )}
                          {date && availability && availability.slots.length > 0 && (
                            <div className="grid grid-cols-3 gap-2.5" data-testid="booking-slots">
                              {availability.slots.map((s) => (
                                <button
                                  key={s}
                                  data-testid={`booking-slot-${s.replace(":", "h")}`}
                                  onClick={() => setSlot(s)}
                                  className={`rounded-xl border py-2.5 text-sm font-medium transition-all duration-200 ${
                                    slot === s
                                      ? "border-sage-deep bg-sage-deep text-white"
                                      : "border-border text-ink-muted hover:border-sage-soft hover:text-ink"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                          {!date && (
                            <div className="grid grid-cols-3 gap-2.5 opacity-40">
                              {["09:00", "10:30", "14:00", "15:30", "17:00", "18:30"].map((s) => (
                                <span key={s} className="rounded-xl border border-border py-2.5 text-center text-sm text-ink-muted">{s}</span>
                              ))}
                            </div>
                          )}
                          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                            Les créneaux affichés tiennent compte des rendez-vous déjà pris et des pauses de déplacement.
                          </p>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid gap-5 sm:grid-cols-2" data-testid="booking-step-details">
                        <div className="space-y-2">
                          <Label htmlFor="booking-name">Nom complet</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                            <Input
                              id="booking-name"
                              data-testid="booking-name-input"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Votre nom"
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="booking-phone">Téléphone</Label>
                          <Input
                            id="booking-phone"
                            data-testid="booking-phone-input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="06 00 00 00 00"
                            type="tel"
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="booking-address">Adresse de la séance (à domicile)</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                            <Input
                              id="booking-address"
                              data-testid="booking-address-input"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Rue, code postal, commune"
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="booking-message">Votre besoin (facultatif)</Label>
                          <Textarea
                            id="booking-message"
                            data-testid="booking-message-input"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Stress, sommeil, préparation d'examen…"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex items-center justify-between">
                  <button
                    data-testid="booking-back-button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors duration-300 hover:text-ink disabled:invisible"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Retour
                  </button>
                  {step < 2 ? (
                    <button
                      data-testid="booking-next-button"
                      onClick={() => canNext && setStep((s) => s + 1)}
                      disabled={!canNext}
                      className="flex items-center gap-1.5 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:bg-sage-deep disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continuer
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      data-testid="booking-submit-button"
                      onClick={confirm}
                      disabled={!canConfirm || submitting}
                      className="flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-white transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:bg-terracotta-hover disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
                      Envoyer ma demande
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
