import { useState, type ElementType } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { apiPut } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { useEditMode } from "@/lib/editMode";
import { toast } from "sonner";
import type { SiteContent } from "@/lib/content";

interface EditableTextProps {
  field: keyof SiteContent;
  value: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
}

export function EditableText({ field, value, as, className, multiline = false }: EditableTextProps) {
  const Tag = (as ?? "span") as ElementType;
  const { enabled } = useEditMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: () => apiPut("/content", { [field]: draft }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Texte mis à jour");
      setEditing(false);
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  if (!enabled) return <Tag className={className}>{value}</Tag>;

  if (editing) {
    return (
      <span className="relative z-30 my-1 block min-w-48 rounded-xl bg-white p-2 text-left shadow-xl ring-2 ring-etoile">
        {multiline ? (
          <textarea
            autoFocus
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            data-testid={`edit-input-${field}`}
            className="w-full bg-transparent text-sm font-normal leading-relaxed text-ink outline-none"
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            data-testid={`edit-input-${field}`}
            className="w-full bg-transparent text-sm font-normal text-ink outline-none"
          />
        )}
        <span className="mt-1.5 flex justify-end gap-1.5">
          <button
            data-testid={`edit-save-${field}`}
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="flex items-center gap-1 rounded-full bg-forest px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:bg-sage-deep disabled:opacity-50"
          >
            {save.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            Enregistrer
          </button>
          <button
            data-testid={`edit-cancel-${field}`}
            onClick={() => setEditing(false)}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
          >
            <X className="h-3 w-3" />
            Annuler
          </button>
        </span>
      </span>
    );
  }

  return (
    <Tag
      className={`${className ?? ""} cursor-pointer rounded transition-shadow duration-200 hover:ring-2 hover:ring-etoile hover:ring-offset-2`}
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      title="Cliquer pour modifier ce texte"
      data-testid={`editable-${field}`}
    >
      {value}
      <Pencil className="mb-1 ml-1.5 inline h-3 w-3 text-etoile opacity-70" aria-hidden="true" />
    </Tag>
  );
}
