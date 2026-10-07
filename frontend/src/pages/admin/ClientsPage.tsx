import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, MapPin, Phone } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { ClientDto } from "@/lib/types";

export default function ClientsPage() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: () => apiGet<ClientDto[]>("/clients"),
  });

  return (
    <div data-testid="admin-clients-page">
      <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">Clients</h1>
      <p className="mt-2 text-sm text-ink-muted">Les fiches se créent automatiquement à chaque demande de rendez-vous.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
        {isLoading ? (
          <p className="px-6 py-12 text-center text-sm text-ink-muted">Chargement…</p>
        ) : (clients ?? []).length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-ink-muted" data-testid="clients-empty">
            Aucun client pour le moment. Les demandes de rendez-vous apparaîtront ici.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="clients-table">
              <thead>
                <tr className="border-b border-border bg-sand/40 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Adresse</th>
                  <th className="px-6 py-4 text-center">Séances</th>
                  <th className="px-6 py-4">Cliente depuis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(clients ?? []).map((c) => (
                  <tr key={c.id} data-testid={`client-row-${c.id}`} className="transition-colors hover:bg-sage-light/40">
                    <td className="px-6 py-4 font-medium text-ink">{c.name}</td>
                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1.5 text-ink-muted"><Phone className="h-3.5 w-3.5" />{c.phone}</p>
                      {c.email && <p className="mt-1 flex items-center gap-1.5 text-ink-muted"><Mail className="h-3.5 w-3.5" />{c.email}</p>}
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{c.address}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="rounded-full bg-sage-light px-3 py-1 text-xs font-semibold text-sage-deep">{c.appointments_count}</span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">{format(parseISO(c.created_at), "d MMM yyyy", { locale: fr })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
