import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2 } from "lucide-react";
import { useEditMode } from "@/lib/editMode";
import { resolveImage } from "@/lib/content";
import { toast } from "sonner";
import { Star4 } from "@/components/landing/Star";

interface EditableImageProps {
  field: "hero_image" | "about_image" | "zone_image" | "about_secondary_image";
  path: string | null;
  fallback: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

export function EditableImage({ field, path, fallback, alt, className, eager = false }: EditableImageProps) {
  const { enabled } = useEditMode();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const src = path ? resolveImage(path, fallback) : fallback;

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("field", field);
      fd.append("file", file);
      const res = await fetch("/api/content/image", { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? "Échec de l'envoi");
      }
      await queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Image mise à jour");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  const placeholder = (
    <div
      className={`${className ?? ""} flex flex-col items-center justify-center gap-3 bg-sage-light p-8 text-center`}
      data-testid={`image-placeholder-${field}`}
    >
      <Star4 className="h-8 w-8 text-etoile" />
      <p className="max-w-xs font-serif text-lg italic text-sage-deep">La photo de l'atelier itinérant arrive bientôt</p>
    </div>
  );

  if (!enabled) {
    if (!src) return placeholder;
    return <img src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} />;
  }

  return (
    <div className="group relative h-full w-full" data-testid={`editable-image-${field}`}>
      {src ? <img src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} /> : placeholder}
      <button
        data-testid={`edit-image-button-${field}`}
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-forest/0 text-sm font-medium text-white opacity-0 transition-all duration-300 hover:bg-forest/55 hover:opacity-100"
      >
        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImageIcon className="h-6 w-6" />}
        {src ? "Changer l'image" : "Ajouter la photo du camping-car"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
