import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2, Save } from "lucide-react";
import { apiGet, apiPut } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { toast } from "sonner";
import { DEFAULT_CONTENT, resolveImage, type SiteContent } from "@/lib/content";

const inputCls =
  "w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-sage-deep";

interface FieldProps {
  label: string;
  testid: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  rows?: number;
  hint?: string;
}

function Field({ label, testid, value, onChange, textarea = false, rows = 3, hint }: FieldProps) {
  return (
    <div>
      <label htmlFor={testid} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {textarea ? (
        <textarea id={testid} data-testid={testid} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      ) : (
        <input id={testid} data-testid={testid} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

function ImageField({ label, fieldKey, value }: { label: string; fieldKey: string; value: string | null }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("field", fieldKey);
      fd.append("file", file);
      const res = await fetch("/api/content/image", { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? "Échec de l'envoi");
      }
      await queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Image mise à jour sur le site");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid={`content-image-${fieldKey}`}>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>
      <div className="flex items-center gap-4">
        {value ? (
          <img src={resolveImage(value, "")} alt={label} className="h-20 w-20 rounded-2xl border border-border object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-border bg-sand/40 text-ink-muted">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        <div>
          <button
            type="button"
            data-testid={`content-image-upload-${fieldKey}`}
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-full border border-sage-deep/30 px-4 py-2 text-sm font-medium text-sage-deep transition-colors hover:bg-sage-light disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            {value ? "Changer l'image" : "Téléverser une image"}
          </button>
          <p className="mt-1.5 text-xs text-ink-muted">jpg, png ou webp — 5 Mo max. Sans image, la photo actuelle du site est conservée.</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
        />
      </div>
    </div>
  );
}

function Card({ title, children, testid }: { title: string; children: React.ReactNode; testid: string }) {
  return (
    <section data-testid={testid} className="rounded-2xl border border-border bg-white p-6">
      <h2 className="font-serif text-lg text-ink">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export default function ContentPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["site-content"], queryFn: () => apiGet<Partial<SiteContent>>("/content") });
  const [form, setForm] = useState<SiteContent | null>(null);

  useEffect(() => {
    if (data && form === null) setForm({ ...DEFAULT_CONTENT, ...data });
  }, [data, form]);

  const saveMutation = useMutation({
    mutationFn: (body: SiteContent) => apiPut("/content", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Contenu du site enregistré");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  if (!form) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-sage-deep" />
      </div>
    );
  }

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const setStep = (index: number, field: "title" | "duration" | "text", value: string) =>
    setForm((f) =>
      f
        ? { ...f, timeline_steps: f.timeline_steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)) }
        : f,
    );

  return (
    <div data-testid="admin-content-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">Contenu du site</h1>
          <p className="mt-2 text-sm text-ink-muted">Modifiez les textes et images de votre site. Les changements sont visibles immédiatement après enregistrement.</p>
        </div>
        <button
          data-testid="content-save-button"
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-deep disabled:opacity-50"
        >
          {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer tout
        </button>
      </div>

      <div className="mt-8 space-y-6">
        <Card title="En-tête (hero)" testid="content-section-hero">
          <Field label="Surtitre" testid="content-hero-surtitre" value={form.hero_surtitre} onChange={(v) => set("hero_surtitre", v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Titre — ligne 1" testid="content-hero-line1" value={form.hero_line1} onChange={(v) => set("hero_line1", v)} />
            <Field label="Titre — mot en italique" testid="content-hero-accent" value={form.hero_line2_accent} onChange={(v) => set("hero_line2_accent", v)} hint="Affiché en vert italique" />
            <Field label="Titre — suite de la ligne 2" testid="content-hero-rest" value={form.hero_line2_rest} onChange={(v) => set("hero_line2_rest", v)} />
            <Field label="Titre — ligne 3" testid="content-hero-line3" value={form.hero_line3} onChange={(v) => set("hero_line3", v)} />
          </div>
          <Field label="Paragraphe d'introduction" testid="content-hero-paragraph" textarea value={form.hero_paragraph} onChange={(v) => set("hero_paragraph", v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Note affichée" testid="content-hero-rating" value={form.hero_rating} onChange={(v) => set("hero_rating", v)} hint="Ex : 4,9/5" />
            <Field label="Texte de la note" testid="content-hero-rating-text" value={form.hero_rating_text} onChange={(v) => set("hero_rating_text", v)} />
          </div>
          <ImageField label="Image du hero" fieldKey="hero_image" value={form.hero_image} />
        </Card>

        <Card title="Bandeau défilant" testid="content-section-marquee">
          <Field
            label="Mots-clés (un par ligne)"
            testid="content-marquee-items"
            textarea
            rows={5}
            value={form.marquee_items.join("\n")}
            onChange={(v) => set("marquee_items", v.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </Card>

        <Card title="À propos" testid="content-section-about">
          <Field label="Titre de la section" testid="content-about-title" value={form.about_title} onChange={(v) => set("about_title", v)} />
          <Field label="Paragraphe 1" testid="content-about-p1" textarea rows={4} value={form.about_paragraph1} onChange={(v) => set("about_paragraph1", v)} />
          <Field label="Paragraphe 2" testid="content-about-p2" textarea rows={4} value={form.about_paragraph2} onChange={(v) => set("about_paragraph2", v)} />
          <Field
            label="Badges (un par ligne)"
            testid="content-about-badges"
            textarea
            value={form.about_badges.join("\n")}
            onChange={(v) => set("about_badges", v.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
          <Field label="Citation" testid="content-about-quote" textarea value={form.about_quote} onChange={(v) => set("about_quote", v)} />
          <Field label="Auteure de la citation" testid="content-about-quote-author" value={form.about_quote_author} onChange={(v) => set("about_quote_author", v)} />
          <ImageField label="Image à propos (portrait)" fieldKey="about_image" value={form.about_image} />
          <Field label="Atelier itinérant — titre" testid="content-secondary-title" value={form.about_secondary_title} onChange={(v) => set("about_secondary_title", v)} />
          <Field label="Atelier itinérant — texte (camping-car)" testid="content-secondary-text" textarea rows={4} value={form.about_secondary_text} onChange={(v) => set("about_secondary_text", v)} />
          <ImageField label="Photo du camping-car aménagé" fieldKey="about_secondary_image" value={form.about_secondary_image} />
        </Card>

        <Card title="Titres des sections" testid="content-section-titles">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prestations — titre" testid="content-services-title" value={form.services_title} onChange={(v) => set("services_title", v)} />
            <Field label="Déroulé — titre" testid="content-timeline-title" value={form.timeline_title} onChange={(v) => set("timeline_title", v)} />
            <Field label="Témoignages — titre" testid="content-testimonials-title" value={form.testimonials_title} onChange={(v) => set("testimonials_title", v)} />
            <Field label="FAQ — titre" testid="content-faq-title" value={form.faq_title} onChange={(v) => set("faq_title", v)} />
            <Field label="Réservation — titre" testid="content-booking-title" value={form.booking_title} onChange={(v) => set("booking_title", v)} />
            <Field label="Contact — titre" testid="content-contact-title" value={form.contact_title} onChange={(v) => set("contact_title", v)} />
          </div>
          <Field label="Prestations — sous-titre" testid="content-services-subtitle" textarea rows={2} value={form.services_subtitle} onChange={(v) => set("services_subtitle", v)} />
          <Field label="Réservation — sous-titre" testid="content-booking-subtitle" textarea rows={2} value={form.booking_subtitle} onChange={(v) => set("booking_subtitle", v)} />
        </Card>

        <Card title="Déroulé d'une séance (4 étapes)" testid="content-section-steps">
          {form.timeline_steps.map((step, i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-sage-deep">Étape {i + 1}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Titre" testid={`content-step-${i}-title`} value={step.title} onChange={(v) => setStep(i, "title", v)} />
                <Field label="Durée" testid={`content-step-${i}-duration`} value={step.duration} onChange={(v) => setStep(i, "duration", v)} />
                <Field label="Description" testid={`content-step-${i}-text`} value={step.text} onChange={(v) => setStep(i, "text", v)} />
              </div>
            </div>
          ))}
          <Field label="Phrase de conclusion" testid="content-timeline-note" textarea rows={2} value={form.timeline_note} onChange={(v) => set("timeline_note", v)} />
        </Card>

        <Card title="Zone d'intervention" testid="content-section-zone">
          <Field label="Titre" testid="content-zone-title" value={form.zone_title} onChange={(v) => set("zone_title", v)} />
          <Field label="Texte" testid="content-zone-text" textarea value={form.zone_text} onChange={(v) => set("zone_text", v)} />
          <Field
            label="Communes desservies (une par ligne)"
            testid="content-communes"
            textarea
            rows={6}
            value={form.communes.join("\n")}
            onChange={(v) => set("communes", v.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
          <Field label="Note sous les communes" testid="content-zone-note" textarea rows={2} value={form.zone_note} onChange={(v) => set("zone_note", v)} />
          <ImageField label="Image de la zone" fieldKey="zone_image" value={form.zone_image} />
        </Card>

        <Card title="Contact & pied de page" testid="content-section-contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Téléphone affiché" testid="content-contact-phone" value={form.contact_phone} onChange={(v) => set("contact_phone", v)} />
            <Field label="E-mail affiché" testid="content-contact-email" value={form.contact_email} onChange={(v) => set("contact_email", v)} />
          </div>
          <Field label="Note de contact" testid="content-contact-note" textarea value={form.contact_note} onChange={(v) => set("contact_note", v)} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Pied de page — ligne 1" testid="content-footer-1" value={form.footer_line1} onChange={(v) => set("footer_line1", v)} />
            <Field label="Ligne 2 (italique)" testid="content-footer-2" value={form.footer_line2} onChange={(v) => set("footer_line2", v)} />
            <Field label="Ligne 3" testid="content-footer-3" value={form.footer_line3} onChange={(v) => set("footer_line3", v)} />
          </div>
        </Card>

        <div className="flex justify-end pb-4">
          <button
            data-testid="content-save-button-bottom"
            onClick={() => saveMutation.mutate(form)}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-deep disabled:opacity-50"
          >
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer tout
          </button>
        </div>
      </div>
    </div>
  );
}
