import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ApiError, apiGet } from "./api";
import type { AdminUser } from "./types";

interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, isLoading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth-me"],
    queryFn: () => apiGet<AdminUser>("/auth/me"),
    retry: false,
    staleTime: 60_000,
  });
  return (
    <AuthContext.Provider value={{ user: isError ? null : (data ?? null), isLoading: isLoading && !isError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-sage-deep" aria-label="Chargement" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

export function formatApiError(err: unknown): string {
  if (err instanceof ApiError) {
    const detail = (err.body as { detail?: unknown } | null)?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((e) => (e && typeof (e as { msg?: unknown }).msg === "string" ? (e as { msg: string }).msg : JSON.stringify(e)))
        .join(" ");
    }
  }
  return "Une erreur est survenue. Réessayez.";
}
