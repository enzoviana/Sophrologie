import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { SERVICES } from "./data";
import { apiGet } from "@/lib/api";
import { formatDuration, formatPrice, type ServiceDto } from "@/lib/types";
import { useSiteContent } from "@/lib/content";
import { EditableText } from "@/components/edit/EditableText";

export const STATIC_SERVICES: ServiceDto[] = SERVICES.map((s, index) => ({
  id: s.id,
  name: s.name,
  description: s.description,
  duration_min: s.id === "enfants-ados" ? 45 : 60,
  price: parseInt(s.price, 10) || 0,
  price_note: s.priceNote ?? (s.price === "Sur devis" ? "Sur devis" : null),
  features: s.features,
  highlight: !!s.highlight,
  active: true,
  display_order: index,
}));

export function useServices(): ServiceDto[] {
  const { data } = useQuery({
    queryKey: ["public-services"],
    queryFn: () => apiGet<ServiceDto[]>("/services"),
    retry: false,
    staleTime: 60_000,
  });
  return data ? data.filter((s) => s.active) : STATIC_SERVICES;
}

export function Services() {
  const content = useSiteContent();
  const services = useServices();
  const regular = services.filter((s) => s.price > 0).slice(0, 3);
  const wide = services.find((s) => s.price === 0);

  return (
    <section id="prestations" data-testid="services-section" className="bg-sand/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">Prestations & tarifs</p>
          <h2 className="mt-3 max-w-2xl font-serif text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
            <EditableText field="services_title" value={content.services_title} />
          </h2>
          <p className="mt-4 max-w-xl text-ink-muted">
            <EditableText field="services_subtitle" value={content.services_subtitle} multiline />
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regular.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.08}>
              <article
                data-testid={`service-card-${service.id}`}
                className={`flex h-full flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                  service.highlight
                    ? "border-sage-deep bg-forest text-cream shadow-xl shadow-sage-deep/25"
                    : "border-border bg-white hover:border-sage-soft hover:shadow-xl hover:shadow-sage-deep/10"
                }`}
              >
                {service.highlight && (
                  <span className="mb-4 w-fit rounded-full bg-terracotta px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    Le plus choisi
                  </span>
                )}
                <h3 className="font-serif text-xl">{service.name}</h3>
                <p className={`mt-1 text-sm ${service.highlight ? "text-sage-soft" : "text-ink-muted"}`}>
                  {formatDuration(service.duration_min)}
                </p>
                <p className="mt-5 flex items-baseline gap-2">
                  <span className="font-serif text-4xl tracking-tight">{formatPrice(service.price)}</span>
                  {service.price_note && (
                    <span className={`text-sm ${service.highlight ? "text-sage-soft" : "text-ink-muted"}`}>
                      {service.price_note}
                    </span>
                  )}
                </p>
                <p className={`mt-4 text-sm leading-relaxed ${service.highlight ? "text-cream/85" : "text-ink-muted"}`}>
                  {service.description}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${service.highlight ? "text-terracotta" : "text-sage-deep"}`} />
                      <span className={service.highlight ? "text-cream/90" : "text-ink-muted"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 space-y-2.5">
                  <Link
                    to={`/rendez-vous?service=${service.id}`}
                    data-testid={`service-book-${service.id}`}
                    className={`block rounded-full py-3 text-center text-sm font-medium transition-all duration-300 ${
                      service.highlight
                        ? "bg-terracotta text-white hover:bg-terracotta-hover"
                        : "border border-sage-deep/30 text-sage-deep hover:bg-sage-light"
                    }`}
                  >
                    Réserver cette formule
                  </Link>
                  <Link
                    to={`/prestations/${service.id}`}
                    data-testid={`service-detail-${service.id}`}
                    className={`group flex items-center justify-center gap-1.5 text-sm font-medium transition-colors ${
                      service.highlight ? "text-sage-soft hover:text-cream" : "text-sage-deep hover:text-forest"
                    }`}
                  >
                    Voir le détail
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {wide && (
          <Reveal delay={0.15}>
            <article
              data-testid={`service-card-${wide.id}`}
              className="mt-6 flex flex-col items-start justify-between gap-6 rounded-3xl border border-dashed border-sage-deep/40 bg-white/60 p-8 sm:flex-row sm:items-center"
            >
              <div>
                <h3 className="font-serif text-xl text-ink">{wide.name} — {formatPrice(wide.price, wide.price_note).toLowerCase()}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">{wide.description}</p>
              </div>
              <Link
                to="/contact"
                data-testid={`service-book-${wide.id}`}
                className="shrink-0 rounded-full border border-sage-deep/30 px-6 py-3 text-sm font-medium text-sage-deep transition-all duration-300 hover:bg-sage-light"
              >
                Demander un devis
              </Link>
            </article>
          </Reveal>
        )}
      </div>
    </section>
  );
}
