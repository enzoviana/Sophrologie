import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Leaf, Pencil, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { toast } from "sonner";
import { formatDuration, formatPrice, type ServiceDto } from "@/lib/types";

interface ServiceForm {
  name: string;
  description: string;
  duration_min: number;
  price: number;
  price_note: string;
  featuresText: string;
  highlight: boolean;
  active: boolean;
}

const EMPTY_FORM: ServiceForm = {
  name: "",
  description: "",
  duration_min: 60,
  price: 55,
  price_note: "",
  featuresText: "",
  highlight: false,
  active: true,
};

const toPayload = (f: ServiceForm) => ({
  name: f.name,
  description: f.description,
  duration_min: f.duration_min,
  price: f.price,
  price_note: f.price_note.trim() || null,
  features: f.featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
  highlight: f.highlight,
  active: f.active,
});

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useQuery({ queryKey: ["admin-services"], queryFn: () => apiGet<ServiceDto[]>("/services") });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);

  const saveMutation = useMutation({
    mutationFn: (payload: ReturnType<typeof toPayload>) =>
      editingId ? apiPut(`/services/${editingId}`, payload) : apiPost("/services", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["public-services"] });
      toast.success(editingId ? "Service mis à jour" : "Service créé");
      setDialogOpen(false);
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["public-services"] });
      toast.success("Service supprimé");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (s: ServiceDto) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      description: s.description,
      duration_min: s.duration_min,
      price: s.price,
      price_note: s.price_note ?? "",
      featuresText: s.features.join("\n"),
      highlight: s.highlight,
      active: s.active,
    });
    setDialogOpen(true);
  };

  const inputClass = "w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm outline-none focus:border-sage-deep";

  return (
    <div data-testid="admin-services-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">Services</h1>
          <p className="mt-2 text-sm text-ink-muted">Ces prestations s'affichent sur le site et dans le formulaire de réservation.</p>
        </div>
        <button
          data-testid="service-create-button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-hover"
        >
          <Plus className="h-4 w-4" /> Nouveau service
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {isLoading && <p className="px-2 py-8 text-sm text-ink-muted">Chargement…</p>}
        {(services ?? []).map((s) => (
          <article key={s.id} data-testid={`admin-service-card-${s.id}`} className={`rounded-2xl border bg-white p-6 ${s.active ? "border-border" : "border-dashed border-border opacity-60"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-serif text-lg text-ink">{s.name}</h3>
                  {s.highlight && <span className="rounded-full bg-terracotta/15 px-2.5 py-0.5 text-xs font-semibold text-terracotta">Mis en avant</span>}
                  {!s.active && <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-ink-muted">Masqué du site</span>}
                </div>
                <p className="mt-1 text-sm font-medium text-sage-deep">{formatPrice(s.price, s.price_note)} · {formatDuration(s.duration_min)}</p>
              </div>
              <div className="flex gap-1.5">
                <button data-testid={`service-edit-${s.id}`} onClick={() => openEdit(s)} aria-label={`Modifier ${s.name}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-sage-deep hover:text-sage-deep">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  data-testid={`service-delete-${s.id}`}
                  onClick={() => { if (window.confirm(`Supprimer « ${s.name} » ?`)) deleteMutation.mutate(s.id); }}
                  aria-label={`Supprimer ${s.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {s.description && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{s.description}</p>}
            {s.features.length > 0 && (
              <ul className="mt-3 space-y-1">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink-muted">
                    <Leaf className="h-3 w-3 text-sage-deep" /> {f}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" data-testid="service-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editingId ? "Modifier le service" : "Nouveau service"}</DialogTitle>
            <DialogDescription>Ces informations sont visibles sur le site public.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(toPayload(form)); }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="service-name" className="mb-1.5 block text-sm font-medium text-ink">Nom de la prestation</label>
              <input id="service-name" data-testid="service-name-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Séance découverte" className={inputClass} />
            </div>
            <div>
              <label htmlFor="service-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
              <textarea id="service-description" data-testid="service-description-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Quelques mots sur cette prestation…" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="service-price" className="mb-1.5 block text-sm font-medium text-ink">Tarif (€)</label>
                <input id="service-price" data-testid="service-price-input" type="number" min={0} step={1} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })} className={inputClass} />
                <p className="mt-1 text-xs text-ink-muted">0 = sur devis</p>
              </div>
              <div>
                <label htmlFor="service-duration" className="mb-1.5 block text-sm font-medium text-ink">Durée (minutes)</label>
                <input id="service-duration" data-testid="service-duration-input" type="number" min={15} step={15} value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: Math.max(15, Number(e.target.value) || 60) })} className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="service-price-note" className="mb-1.5 block text-sm font-medium text-ink">Note de tarif (facultatif)</label>
              <input id="service-price-note" data-testid="service-price-note-input" value={form.price_note} onChange={(e) => setForm({ ...form, price_note: e.target.value })} placeholder="5 séances, soit 50 € la séance" className={inputClass} />
            </div>
            <div>
              <label htmlFor="service-features" className="mb-1.5 block text-sm font-medium text-ink">Points forts (un par ligne)</label>
              <textarea id="service-features" data-testid="service-features-input" rows={3} value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} placeholder={"Entretien personnalisé\nCarnet offert"} className={inputClass} />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input type="checkbox" data-testid="service-highlight-checkbox" checked={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.checked })} className="h-4 w-4 accent-[#4E6B50]" />
                Mettre en avant sur le site
              </label>
              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input type="checkbox" data-testid="service-active-checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-[#4E6B50]" />
                Visible et réservable
              </label>
            </div>
            <button
              data-testid="service-save-button"
              type="submit"
              disabled={saveMutation.isPending || !form.name.trim()}
              className="w-full rounded-full bg-forest py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-deep disabled:opacity-50"
            >
              {editingId ? "Enregistrer les modifications" : "Créer le service"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
