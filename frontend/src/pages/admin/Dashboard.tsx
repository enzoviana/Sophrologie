import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format, addDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarCheck, Check, Clock, Leaf, Users, X } from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { toast } from "sonner";
import type { AppointmentDto, ClientDto, ServiceDto } from "@/lib/types";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: appointments } = useQuery({ queryKey: ["admin-appointments", "all"], queryFn: () => apiGet<AppointmentDto[]>("/appointments") });
  const { data: clients } = useQuery({ queryKey: ["admin-clients"], queryFn: () => apiGet<ClientDto[]>("/clients") });
  const { data: services } = useQuery({ queryKey: ["admin-services"], queryFn: () => apiGet<ServiceDto[]>("/services") });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiPatch(`/appointments/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast.success("Rendez-vous mis à jour");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const all = appointments ?? [];
  const pendingList = all.filter((a) => a.status === "pending");
  const today = new Date();
  const weekEnd = format(addDays(today, 7), "yyyy-MM-dd");
  const todayStr = format(today, "yyyy-MM-dd");
  const confirmedThisWeek = all.filter((a) => a.status === "confirmed" && a.date >= todayStr && a.date <= weekEnd);

  const stats = [
    { label: "Demandes en attente", value: pendingList.length, icon: Clock, testid: "stat-pending" },
    { label: "RDV confirmés (7 jours)", value: confirmedThisWeek.length, icon: CalendarCheck, testid: "stat-week" },
    { label: "Clients", value: clients?.length ?? 0, icon: Users, testid: "stat-clients" },
    { label: "Services actifs", value: (services ?? []).filter((s) => s.active).length, icon: Leaf, testid: "stat-services" },
  ];

  return (
    <div data-testid="admin-dashboard">
      <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">Tableau de bord</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} data-testid={stat.testid} className="rounded-2xl border border-border bg-white p-6">
            <stat.icon className="h-5 w-5 text-sage-deep" />
            <p className="mt-4 font-serif text-3xl tracking-tight text-ink">{stat.value}</p>
            <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-serif text-lg text-ink">Demandes à confirmer</h2>
          <Link to="/admin/rendez-vous" data-testid="dashboard-see-all-link" className="text-sm font-medium text-sage-deep hover:text-forest">
            Tout voir
          </Link>
        </div>
        {pendingList.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-muted">Aucune demande en attente. Tout est à jour.</p>
        ) : (
          <ul className="divide-y divide-border">
            {pendingList.slice(0, 5).map((a) => (
              <li key={a.id} data-testid={`dashboard-pending-${a.id}`} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <p className="font-medium text-ink">{a.client_name}</p>
                  <p className="text-sm text-ink-muted">
                    {a.service_name} · <span className="capitalize">{format(parseISO(a.date), "EEEE d MMMM", { locale: fr })}</span> à {a.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    data-testid={`dashboard-confirm-${a.id}`}
                    onClick={() => statusMutation.mutate({ id: a.id, status: "confirmed" })}
                    className="flex items-center gap-1.5 rounded-full bg-sage-deep px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-forest"
                  >
                    <Check className="h-3.5 w-3.5" /> Confirmer
                  </button>
                  <button
                    data-testid={`dashboard-refuse-${a.id}`}
                    onClick={() => statusMutation.mutate({ id: a.id, status: "refused" })}
                    className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" /> Refuser
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
