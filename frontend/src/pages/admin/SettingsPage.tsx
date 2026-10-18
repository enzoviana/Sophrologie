import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, Save, Database, AlertTriangle } from "lucide-react";
import { apiGet, apiPost, apiPut, getApiUrl } from "@/lib/api";
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

  const migrateMutation = useMutation({
    mutationFn: () => apiPost<{ ok: boolean; message: string; report: any }>("/admin/migrate", {}),
    onSuccess: (data) => {
      if (data.ok) {
        toast.success(data.message || "Migration réussie");
        console.log("Migration report:", data.report);
      } else {
        toast.error(data.message || "Erreur lors de la migration");
      }
      queryClient.invalidateQueries();
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(getApiUrl("/profile/photo"), {
        method: "POST",
        body: fd,
        credentials: "include"
      });
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
  const photoUrl = profile?.photo_path ? getApiUrl(`/files/${profile.photo_path}`) : null;

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

      {/* Section maintenance */}
      <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h2 className="font-serif text-lg font-medium text-yellow-900">Outils de maintenance</h2>
            <p className="mt-1 text-sm text-yellow-800">
              Utilisez ces outils si vous rencontrez des problèmes avec la base de données ou après une mise à jour.
            </p>
            <button
              data-testid="migrate-button"
              onClick={() => {
                if (confirm("Voulez-vous vraiment lancer la migration de la base de données ? Cette opération va vérifier et corriger les données si nécessaire.")) {
                  migrateMutation.mutate();
                }
              }}
              disabled={migrateMutation.isPending}
              className="mt-4 flex items-center gap-2 rounded-full bg-yellow-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
            >
              {migrateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              {migrateMutation.isPending ? "Migration en cours..." : "Migrer la base de données"}
            </button>
            <p className="mt-3 text-xs text-yellow-700">
              Cette action va corriger les services sans display_order, les rendez-vous sans statut, et autres problèmes de schéma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
