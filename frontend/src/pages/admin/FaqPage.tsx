import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleHelp, Pencil, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { toast } from "sonner";
import type { FaqDto } from "@/lib/content";

interface FaqForm {
  question: string;
  answer: string;
}

const EMPTY: FaqForm = { question: "", answer: "" };

const inputCls =
  "w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-sage-deep";

export default function FaqPage() {
  const queryClient = useQueryClient();
  const { data: faqs } = useQuery({ queryKey: ["public-faqs"], queryFn: () => apiGet<FaqDto[]>("/faqs"), retry: false });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FaqForm>(EMPTY);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["public-faqs"] });

  const saveMutation = useMutation({
    mutationFn: (body: FaqForm) => (editingId ? apiPut(`/faqs/${editingId}`, body) : apiPost("/faqs", body)),
    onSuccess: () => {
      invalidate();
      toast.success(editingId ? "Question mise à jour" : "Question ajoutée");
      setDialogOpen(false);
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/faqs/${id}`),
    onSuccess: () => {
      invalidate();
      toast.success("Question supprimée");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const openEdit = (f: FaqDto) => {
    setEditingId(f.id);
    setForm({ question: f.question, answer: f.answer });
    setDialogOpen(true);
  };

  return (
    <div data-testid="admin-faq-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">Questions fréquentes</h1>
          <p className="mt-2 text-sm text-ink-muted">Elles s'affichent dans la section FAQ du site.</p>
        </div>
        <button
          data-testid="faq-create-button"
          onClick={() => { setEditingId(null); setForm(EMPTY); setDialogOpen(true); }}
          className="flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-hover"
        >
          <Plus className="h-4 w-4" /> Ajouter une question
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {(faqs ?? []).map((f) => (
          <article key={f.id} data-testid={`admin-faq-${f.id}`} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-white p-6">
            <div className="flex items-start gap-4">
              <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-sage-deep" />
              <div>
                <h3 className="font-medium text-ink">{f.question}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{f.answer}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button data-testid={`faq-edit-${f.id}`} onClick={() => openEdit(f)} aria-label="Modifier" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-sage-deep hover:text-sage-deep">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                data-testid={`faq-delete-${f.id}`}
                onClick={() => { if (window.confirm("Supprimer cette question ?")) deleteMutation.mutate(f.id); }}
                aria-label="Supprimer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg" data-testid="faq-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editingId ? "Modifier la question" : "Nouvelle question"}</DialogTitle>
            <DialogDescription>Visible immédiatement sur le site après enregistrement.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div>
              <label htmlFor="faq-question" className="mb-1.5 block text-sm font-medium text-ink">Question</label>
              <input id="faq-question" data-testid="faq-question-input" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label htmlFor="faq-answer" className="mb-1.5 block text-sm font-medium text-ink">Réponse</label>
              <textarea id="faq-answer" data-testid="faq-answer-input" required rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className={inputCls} />
            </div>
            <button
              data-testid="faq-save-button"
              type="submit"
              disabled={saveMutation.isPending || !form.question.trim() || !form.answer.trim()}
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
