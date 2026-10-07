import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, Save } from "lucide-react";
import { apiGet, apiPut } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { toast } from "sonner";
import type { ProfileDto } from "@/lib/types";

interface ProfileForm {
  display_name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  zone: string;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => apiGet<ProfileDto>("/profile") });
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && form === null) {
      setForm({
        display_name: profile.display_name,
        title: profile.title,
        bio: profile.bio,
        phone: profile.phone,
        email: profile.email,
        zone: profile.zone,
      });
    }
  }, [profile, form]);

  const saveMutation = useMutation({
    mutationFn: (body: ProfileForm) => apiPut("/profile", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil enregistré");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/profile/photo", { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? "Échec de l'envoi");
      }
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Photo de profil mise à jour");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  if (!form) return null;

  const inputClass = "w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm outline-none focus:border-sage-deep";
  const photoUrl = profile?.photo_path ? `/api/files/${profile.photo_path}` : null;

  return (
    <div data-testid="admin-settings-page">
      <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">Paramètres</h1>
      <p className="mt-2 text-sm text-ink-muted">Votre profil public et votre photo.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6 text-center" data-testid="profile-photo-card">
          <div className="relative mx-auto h-36 w-36">
            {photoUrl ? (
              <img src={photoUrl} alt="Photo de profil" className="h-36 w-36 rounded-full border-4 border-sage-light object-cover" data-testid="profile-photo-preview" />
            ) : (
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-sage-light bg-sage-light font-serif text-4xl text-sage-deep" data-testid="profile-photo-placeholder">
                {form.display_name.charAt(0) || "K"}
              </div>
            )}
            <button
              data-testid="profile-photo-upload-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Changer la photo"
              className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full bg-terracotta text-white shadow-lg transition-colors hover:bg-terracotta-hover disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
            </button>
          </div>
          <input
            ref={fileInputRef}
            data-testid="profile-photo-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); e.target.value = ""; }}
          />
          <p className="mt-4 font-serif text-lg text-ink">{form.display_name}</p>
          <p className="text-sm text-ink-muted">{form.title}</p>
          <p className="mt-3 text-xs text-ink-muted">jpg, png ou webp — 5 Mo max</p>
        </div>

        <form
          className="space-y-5 rounded-2xl border border-border bg-white p-6 lg:col-span-2"
          onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-ink">Nom affiché</label>
              <input id="profile-name" data-testid="profile-name-input" required value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="profile-title" className="mb-1.5 block text-sm font-medium text-ink">Titre</label>
              <input id="profile-title" data-testid="profile-title-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sophrologue passionnée" className={inputClass} />
            </div>
            <div>
              <label htmlFor="profile-phone" className="mb-1.5 block text-sm font-medium text-ink">Téléphone</label>
              <input id="profile-phone" data-testid="profile-phone-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-ink">E-mail de contact</label>
              <input id="profile-email" data-testid="profile-email-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="profile-zone" className="mb-1.5 block text-sm font-medium text-ink">Zone d'intervention</label>
            <input id="profile-zone" data-testid="profile-zone-input" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-medium text-ink">Présentation</label>
            <textarea id="profile-bio" data-testid="profile-bio-input" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={inputClass} />
          </div>
          <button
            data-testid="profile-save-button"
            type="submit"
            disabled={saveMutation.isPending || !form.display_name.trim()}
            className="flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-deep disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Enregistrer le profil
          </button>
        </form>
      </div>
    </div>
  );
}
