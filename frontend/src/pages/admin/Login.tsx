import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Leaf, Loader2 } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { formatApiError, useAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import type { AdminUser } from "@/lib/types";

export default function AdminLogin() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && user) return <Navigate to="/admin" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await apiPost<AdminUser>("/auth/login", { email, password });
      queryClient.setQueryData(["auth-me"], data);
      beginSession();
      // Force a full page reload to ensure auth state is properly initialized
      window.location.href = "/admin";
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="grain-overlay" aria-hidden="true" />
      <div data-testid="admin-login-card" className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl shadow-sage-deep/10 sm:p-10">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center font-serif text-2xl tracking-tight text-ink">Espace administrateur</h1>
        <p className="mt-2 text-center text-sm text-ink-muted">Gérez vos rendez-vous, services et clientes.</p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium text-ink">E-mail</label>
            <input
              id="login-email"
              data-testid="login-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="katia@monateliersophro.fr"
              className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-sage-deep"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-password" className="text-sm font-medium text-ink">Mot de passe</label>
            <input
              id="login-password"
              data-testid="login-password-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-sage-deep"
            />
          </div>
          {error && (
            <p data-testid="login-error" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            data-testid="login-submit-button"
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:bg-sage-deep disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Leaf className="h-4 w-4" />}
            Se connecter
          </button>
        </form>

        <p className="mt-6 rounded-xl bg-sage-light px-4 py-3 text-center text-xs leading-relaxed text-forest">
          Démo : katia@monateliersophro.fr · AtelierSophro2026!
        </p>
      </div>
    </div>
  );
}
