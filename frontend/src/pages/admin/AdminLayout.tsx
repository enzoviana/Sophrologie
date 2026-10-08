import { useEffect, useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CircleHelp,
  FileText,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Palette,
  Quote,
  Settings,
  Users,
  X,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { useAuth } from "@/lib/auth";
import { endSession } from "@/lib/session";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { apiGet } from "@/lib/api";
import type { AppointmentDto } from "@/lib/types";
import { Toaster } from "@/components/ui/sonner";

const LINKS = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/rendez-vous", label: "Rendez-vous", icon: CalendarCheck, end: false },
  { to: "/admin/calendrier", label: "Calendrier", icon: CalendarDays, end: false },
  { to: "/admin/clients", label: "Clients", icon: Users, end: false },
  { to: "/admin/services", label: "Services", icon: Leaf, end: false },
  { to: "/admin/contenu", label: "Contenu du site", icon: FileText, end: false },
  { to: "/admin/temoignages", label: "Témoignages", icon: Quote, end: false },
  { to: "/admin/faq", label: "FAQ", icon: CircleHelp, end: false },
  { to: "/admin/theme", label: "Thème & Couleurs", icon: Palette, end: false },
  { to: "/admin/guide", label: "Guide d'utilisation", icon: BookOpen, end: false },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings, end: false },
];

function NavItems({ pendingCount, onNavigate }: { pendingCount: number; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6" aria-label="Navigation admin">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          data-testid={`admin-nav-${link.to.replace("/admin", "").replaceAll("/", "") || "dashboard"}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              isActive ? "bg-sage-light text-forest" : "text-ink-muted hover:bg-sand/60 hover:text-ink"
            }`
          }
        >
          <link.icon className="h-4.5 w-4.5 shrink-0" />
          <span className="flex-1">{link.label}</span>
          {link.to === "/admin/rendez-vous" && pendingCount > 0 && (
            <span data-testid="pending-count-badge" className="rounded-full bg-terracotta px-2 py-0.5 text-xs font-semibold text-white">
              {pendingCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [menuOpen]);
  const { data: pending } = useQuery({
    queryKey: ["admin-appointments", "pending"],
    queryFn: () => apiGet<AppointmentDto[]>("/appointments?status=pending"),
  });
  const pendingCount = pending?.length ?? 0;

  const sidebarFooter = (
    <div className="border-t border-border px-4 py-4">
      <Link
        to="/"
        data-testid="admin-view-site-link"
        className="mb-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-ink-muted transition-colors hover:bg-sand/60 hover:text-ink"
      >
        <ExternalLink className="h-4 w-4" />
        Voir le site
      </Link>
      <button
        data-testid="admin-logout-button"
        onClick={() => endSession("/admin/login")}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-ink-muted transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        Se déconnecter
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream" data-testid="admin-shell">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-white lg:flex">
        <div className="border-b border-border px-5 py-4">
          <Logo />
        </div>
        <NavItems pendingCount={pendingCount} />
        {sidebarFooter}
      </aside>

      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-cream/90 px-5 py-3 backdrop-blur-xl lg:hidden">
        <Logo />
        <button
          data-testid="admin-burger-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu admin"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-soft text-forest"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-forest/45 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              data-testid="admin-mobile-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85%] flex-col bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Logo />
                <button
                  data-testid="admin-close-button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-soft text-forest"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavItems pendingCount={pendingCount} onNavigate={() => setMenuOpen(false)} />
              {sidebarFooter}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <p className="mb-6 text-sm text-ink-muted">
            Bonjour <span className="font-medium text-ink">{user?.name}</span>, belle journée à vous.
          </p>
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
