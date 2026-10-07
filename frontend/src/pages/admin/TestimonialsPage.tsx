import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Quote, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { toast } from "sonner";
import { STATIC_TESTIMONIALS, type TestimonialDto } from "@/lib/content";

interface TestimonialForm {
  quote: string;
  author: string;
  context: string;
}

const EMPTY: TestimonialForm = { quote: "", author: "", context: "" };

const inputCls =
  "w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-sage-deep";

export default function TestimonialsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["public-testimonials"], queryFn: () => apiGet<TestimonialDto[]>("/testimonials"), retry: false });
  const testimonials = data ?? [];
  const isLive = data !== undefined;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(EMPTY);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["public-testimonials"] });

  const saveMutation = useMutation({
    mutationFn: (body: TestimonialForm) => (editingId ? apiPut(`/testimonials/${editingId}`, body) : apiPost("/testimonials", body)),
    onSuccess: () => {
      invalidate();
      toast.success(editingId ? "Témoignage mis à jour" : "Témoignage ajouté");
      setDialogOpen(false);
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/testimonials/${id}`),
    onSuccess: () => {
      invalidate();
      toast.success("Témoignage supprimé");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const openEdit = (t: TestimonialDto) => {
    setEditingId(t.id);
    setForm({ quote: t.quote, author: t.author, context: t.context });
    setDialogOpen(true);
  };

  return (
    <div data-testid="admin-testimonials-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">Témoignages</h1>
          <p className="mt-2 text-sm text-ink-muted">Ils s'affichent dans la section « Témoignages » du site.</p>
        </div>
        <button
          data-testid="testimonial-create-button"
          onClick={() => { setEditingId(null); setForm(EMPTY); setDialogOpen(true); }}
          className="flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-hover"
        >
          <Plus className="h-4 w-4" /> Ajouter un témoignage
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <article key={t.id} data-testid={`admin-testimonial-${t.id}`} className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <Quote className="h-6 w-6 shrink-0 text-sage-soft" />
              <div className="flex gap-1.5">
                <button data-testid={`testimonial-edit-${t.id}`} onClick={() => openEdit(t)} aria-label="Modifier" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-sage-deep hover:text-sage-deep">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  data-testid={`testimonial-delete-${t.id}`}
                  onClick={() => { if (window.confirm("Supprimer ce témoignage ?")) deleteMutation.mutate(t.id); }}
                  aria-label="Supprimer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-ink">« {t.quote} »</blockquote>
            <p className="mt-4 border-t border-border pt-3 text-sm">
              <span className="font-serif text-ink">{t.author}</span>
              <span className="block text-ink-muted">{t.context}</span>
            </p>
          </article>
        ))}
        {!isLive && STATIC_TESTIMONIALS.length > 0 && null}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg" data-testid="testimonial-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editingId ? "Modifier le témoignage" : "Nouveau témoignage"}</DialogTitle>
            <DialogDescription>Visible immédiatement sur le site après enregistrement.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div>
              <label htmlFor="testimonial-quote" className="mb-1.5 block text-sm font-medium text-ink">Témoignage</label>
              <textarea id="testimonial-quote" data-testid="testimonial-quote-input" required rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className={inputCls} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="testimonial-author" className="mb-1.5 block text-sm font-medium text-ink">Prénom / initiales</label>
                <input id="testimonial-author" data-testid="testimonial-author-input" required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Marie L." className={inputCls} />
              </div>
              <div>
                <label htmlFor="testimonial-context" className="mb-1.5 block text-sm font-medium text-ink">Contexte</label>
                <input id="testimonial-context" data-testid="testimonial-context-input" value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} placeholder="Sommeil · Aspet" className={inputCls} />
              </div>
            </div>
            <button
              data-testid="testimonial-save-button"
              type="submit"
              disabled={saveMutation.isPending || !form.quote.trim() || !form.author.trim()}
              className="w-full rounded-full bg-forest py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-deep disabled:opacity-50"
            >
              {editingId ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
