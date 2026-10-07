import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Menu, X, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { NAV_LINKS } from "./data";
import { useSiteContent } from "@/lib/content";
import { lockScroll, unlockScroll } from "@/lib/lenis";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const content = useSiteContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [menuOpen]);

  return (
    <>
      <header
        data-testid="main-navbar"
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled ? "bg-cream/85 shadow-[0_1px_0_0_rgba(228,221,211,0.7)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-300 ${
                    isActive ? "font-medium text-forest" : "text-ink-muted hover:text-forest"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 rounded-full border border-sage-soft bg-sage-light px-3 py-1.5 text-xs font-medium text-sage-deep md:flex">
              <MapPin className="h-3.5 w-3.5" />
              Itinérante · 31160
            </span>
            <Link
              to="/rendez-vous"
              data-testid="nav-booking-button"
              className="hidden rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-hover sm:block"
            >
              Prendre rendez-vous
            </Link>
            <button
              data-testid="nav-burger-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-soft bg-cream/80 text-forest backdrop-blur transition-colors duration-300 hover:bg-sage-light lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              data-testid="nav-mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[80] bg-forest/45 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              data-testid="nav-mobile-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed right-0 top-0 z-[90] flex h-[100dvh] w-[86%] max-w-sm flex-col bg-cream shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <Logo />
                <button
                  data-testid="nav-close-button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-soft text-forest transition-colors duration-300 hover:bg-sage-light"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Navigation mobile">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.to}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                    >
                      <NavLink
                        to={link.to}
                        end={link.end}
                        data-testid={`nav-mobile-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                        onClick={() => setMenuOpen(false)}
                        className="group flex w-full items-center justify-between border-b border-border/70 py-4 text-left"
                      >
                        <span className="font-serif text-2xl tracking-tight text-ink transition-colors duration-300 group-hover:text-sage-deep">
                          {link.label}
                        </span>
                        <span className="font-serif text-sm italic text-terracotta">0{i + 1}</span>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Link
                    to="/rendez-vous"
                    data-testid="nav-mobile-booking-button"
                    onClick={() => setMenuOpen(false)}
                    className="mt-8 block w-full rounded-full bg-terracotta py-4 text-center text-sm font-medium text-white transition-colors duration-300 hover:bg-terracotta-hover"
                  >
                    Prendre rendez-vous
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                  className="mt-8 space-y-3"
                >
                  <a
                    data-testid="nav-mobile-phone-link"
                    href={`tel:${content.contact_phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-ink-muted transition-colors duration-300 hover:text-forest"
                  >
                    <Phone className="h-4 w-4 text-sage-deep" />
                    {content.contact_phone}
                  </a>
                  <a
                    data-testid="nav-mobile-email-link"
                    href={`mailto:${content.contact_email}`}
                    className="flex items-center gap-3 break-all text-sm text-ink-muted transition-colors duration-300 hover:text-forest"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-sage-deep" />
                    {content.contact_email}
                  </a>
                </motion.div>
              </nav>

              <div className="border-t border-border px-6 py-4">
                <span className="flex items-center gap-1.5 text-xs font-medium text-sage-deep">
                  <MapPin className="h-3.5 w-3.5" />
                  Itinérante · 20 km autour d'Arguenos, 31160
                </span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
