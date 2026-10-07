import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarCheck, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/landing/Reveal";
import { STATIC_SERVICES } from "@/components/landing/Services";
import { resolveImage, useSiteContent } from "@/lib/content";
import { formatDuration, formatPrice } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { ServiceDto } from "@/lib/types";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1500259783852-0ca9ce8a64dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHw0fHxzb3Bocm9sb2d5JTIwbWVkaXRhdGlvbiUyMHdvbWFuJTIwbmF0dXJlfGVufDB8fHx8MTc5MTAzOTAxNHww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1518708909080-704599b19972?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwyfHx3b21hbiUyMG1lZGl0YXRpbmclMjBicmVhdGhpbmclMjBuYXR1cmUlMjBjYWxtfGVufDB8fHx8MTc5MTAzOTA0N3ww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1694961585324-2e1162cc45f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHw0fHxweXJlbmVlcyUyMG1vdW50YWlucyUyMGxhbmRzY2FwZSUyMGZyYW5jZXxlbnwwfHx8fDE3OTEwMzkwMTR8MA&ixlib=rb-4.1.0&q=85",
];

export default function PrestationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const content = useSiteContent();
  const { data } = useQuery({
    queryKey: ["public-services"],
    queryFn: () => apiGet<ServiceDto[]>("/services"),
    retry: false,
    staleTime: 60_000,
  });
  const services = data ? data.filter((s) => s.active) : STATIC_SERVICES;
  const service = services.find((s) => s.id === id);
  const others = services.filter((s) => s.id !== id).slice(0, 3);

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-40 text-center" data-testid="prestation-not-found">
        <Seo title="Prestation introuvable" description="Cette prestation n'existe pas ou plus." path={`/prestations/${id}`} noindex />
        <h1 className="font-serif text-3xl tracking-tight text-ink">Cette prestation n'existe pas ou plus</h1>
        <p className="mt-4 text-ink-muted">Elle a peut-être été retirée du site.</p>
        <Link to="/prestations" className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-sage-deep">
          <ArrowLeft className="h-4 w-4" /> Voir toutes les prestations
        </Link>
      </div>
    );
  }

  const image = resolveImage(content.about_image, FALLBACK_IMAGES[services.indexOf(service) % FALLBACK_IMAGES.length]);

  return (
    <div className="pt-[72px]" data-testid="prestation-detail-page">
      <Seo
        title={`${service.name} — Sophrologie à domicile (${formatDuration(service.duration_min)}, ${formatPrice(service.price, service.price_note)})`}
        description={`${service.name} : ${service.description} Séance de sophrologie à domicile dans le Comminges, 20 km autour d'Arguenos (31160), Aspet, Saint-Gaudens, Salies-du-Salat. Réservation en ligne.`}
        keywords={`${service.name.toLowerCase()}, sophrologie à domicile, séance sophrologie ${formatPrice(service.price, service.price_note)}, réserver sophrologue Comminges`}
        path={`/prestations/${service.id}`}
      />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <Link to="/prestations" data-testid="prestation-back-link" className="group inline-flex items-center gap-2 text-sm font-medium text-sage-deep transition-colors hover:text-forest">
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Toutes les prestations
        </Link>

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="blob-frame overflow-hidden shadow-2xl shadow-sage-deep/20">
              <img src={image} alt={`${service.name} — sophrologie à domicile dans le Comminges`} className="aspect-[4/5] w-full object-cover" loading="eager" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {service.highlight && (
              <span className="rounded-full bg-terracotta px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                Le plus choisi
              </span>
            )}
            <h1 className="mt-4 font-serif text-3xl tracking-tight text-ink sm:text-4xl lg:text-5xl">{service.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sage-light px-4 py-2 text-sm font-medium text-sage-deep">
                <Clock className="mr-1.5 inline h-4 w-4" />
                {formatDuration(service.duration_min)}
              </span>
              <span className="rounded-full bg-sage-light px-4 py-2 text-sm font-medium text-sage-deep">
                <MapPin className="mr-1.5 inline h-4 w-4" />
                À votre domicile
              </span>
            </div>
            <p className="mt-6 flex items-baseline gap-3">
              <span className="font-serif text-5xl tracking-tight text-ink">{formatPrice(service.price, service.price_note)}</span>
              {service.price_note && service.price > 0 && <span className="text-ink-muted">{service.price_note}</span>}
            </p>
            <p className="mt-6 leading-relaxed text-ink-muted">{service.description}</p>

            {service.features.length > 0 && (
              <div className="mt-8 rounded-2xl border border-border bg-white p-6">
                <h2 className="font-serif text-lg text-ink">Cette prestation comprend</h2>
                <ul className="mt-4 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-ink-muted">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-light">
                        <Check className="h-3 w-3 text-sage-deep" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              {service.price > 0 ? (
                <Link
                  to={`/rendez-vous?service=${service.id}`}
                  data-testid="prestation-book-button"
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-hover"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Réserver cette prestation
                </Link>
              ) : (
                <Link
                  to="/contact"
                  data-testid="prestation-quote-button"
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-hover"
                >
                  <Mail className="h-4 w-4" />
                  Demander un devis
                </Link>
              )}
              <a
                href={`tel:${content.contact_phone.replace(/\s/g, "")}`}
                data-testid="prestation-call-button"
                className="inline-flex items-center gap-2 rounded-full border border-sage-deep/30 px-7 py-3.5 text-sm font-medium text-sage-deep transition-colors hover:bg-sage-light"
              >
                <Phone className="h-4 w-4" />
                {content.contact_phone}
              </a>
            </div>
            <p className="mt-5 text-sm text-ink-muted">
              Déplacement inclus dans un rayon de 20 km autour d'Arguenos (31160). Chaque demande est confirmée personnellement par Katia sous 24 h.
            </p>
          </Reveal>
        </div>

        {others.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-2xl tracking-tight text-ink">Découvrir aussi</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.id}
                  to={`/prestations/${other.id}`}
                  data-testid={`prestation-other-${other.id}`}
                  className="group rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sage-soft hover:shadow-lg hover:shadow-sage-deep/10"
                >
                  <h3 className="font-serif text-lg text-ink">{other.name}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{formatDuration(other.duration_min)} · {formatPrice(other.price, other.price_note)}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-sage-deep">
                    Voir le détail
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
