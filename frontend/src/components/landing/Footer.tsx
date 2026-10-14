import { Link, NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { NAV_LINKS } from "./data";
import { useSiteContent } from "@/lib/content";
import { Star4 } from "./Star";
import { EditableText } from "@/components/edit/EditableText";
import { Facebook, Instagram, Linkedin, Calendar, MapPin } from "lucide-react";

export function Footer() {
  const content = useSiteContent();

  const socialLinks = [
    { url: content.social_facebook, icon: Facebook, label: "Facebook", testid: "facebook" },
    { url: content.social_instagram, icon: Instagram, label: "Instagram", testid: "instagram" },
    { url: content.social_linkedin, icon: Linkedin, label: "LinkedIn", testid: "linkedin" },
    { url: content.social_resalib, icon: Calendar, label: "Resalib", testid: "resalib" },
    { url: content.social_google, icon: MapPin, label: "Google", testid: "google" },
  ].filter(link => link.url && link.url.trim() !== "");

  return (
    <footer data-testid="main-footer" className="relative overflow-hidden bg-forest pb-10 pt-20 text-cream">
      {/* Étoiles décoratives - plus nombreuses pour plus de luminosité */}
      <Star4 className="absolute right-10 top-10 h-5 w-5 text-etoile/60" />
      <Star4 className="absolute right-24 top-24 h-3 w-3 text-etoile/40" />
      <Star4 className="absolute left-12 top-16 h-4 w-4 text-etoile-soft/50" />
      <Star4 className="absolute left-28 top-32 h-6 w-6 text-etoile/70" />
      <Star4 className="absolute right-[45%] top-12 h-3.5 w-3.5 text-etoile/45" />
      <Star4 className="absolute left-[15%] bottom-32 h-5 w-5 text-etoile-soft/60" />
      <Star4 className="absolute right-[20%] bottom-24 h-4 w-4 text-etoile/50" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <p className="max-w-3xl font-serif text-3xl leading-snug tracking-tight sm:text-4xl lg:text-5xl">
          <EditableText field="footer_line1" value={content.footer_line1} />{" "}
          <span className="italic text-sage-soft">
            <EditableText field="footer_line2" value={content.footer_line2} />
          </span>
          <br />
          <EditableText field="footer_line3" value={content.footer_line3} />
        </p>

        <div className="mt-16 flex flex-col justify-between gap-10 border-t border-sage-deep/40 pt-10 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <Logo dark />
            {socialLinks.length > 0 && (
              <div className="flex gap-3" data-testid="social-links">
                {socialLinks.map((link) => (
                  <a
                    key={link.testid}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    data-testid={`social-link-${link.testid}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-deep/40 text-cream/70 transition-all duration-300 hover:border-etoile hover:bg-etoile/10 hover:text-cream"
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-3" aria-label="Navigation pied de page">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                data-testid={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                className="text-sm text-cream/70 transition-colors duration-300 hover:text-cream"
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/rendez-vous"
              data-testid="footer-link-rendez-vous"
              className="text-sm text-etoile transition-colors duration-300 hover:text-cream"
            >
              Prendre rendez-vous
            </Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-sage-deep/40 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center">
          <p>© 2026 Mon Atelier Sophro — Katia Guijarro, sophrologue itinérante à domicile · Arguenos, 31160, Comminges</p>
          <p>
            <Link to="/mentions-legales" data-testid="footer-legal-link" className="underline underline-offset-2 transition-colors hover:text-cream">
              Mentions légales
            </Link>
            {" · "}
            Incubatest BGE — SIRET 424 845 949 001 16
          </p>
        </div>
      </div>
    </footer>
  );
}
