import { MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteContent } from "@/lib/content";
import { EditableText } from "@/components/edit/EditableText";
import { ZoneMap } from "./ZoneMap";

export function Zone() {
  const content = useSiteContent();
  return (
    <section id="zone" data-testid="zone-intervention-section" className="bg-forest py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-soft">Zone d'intervention</p>
          <h2 className="mt-3 font-serif text-2xl tracking-tight text-cream sm:text-3xl lg:text-4xl">
            <EditableText field="zone_title" value={content.zone_title} />
          </h2>
          <p className="mt-5 leading-relaxed text-cream/75">
            <EditableText field="zone_text" value={content.zone_text} multiline />
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5" data-testid="communes-list">
            {content.communes.map((commune) => (
              <span
                key={commune}
                className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
                  commune === "Arguenos"
                    ? "border-terracotta bg-terracotta font-medium text-white"
                    : "border-sage-deep/50 text-cream/80 hover:border-sage-soft hover:text-cream"
                }`}
              >
                {commune}
              </span>
            ))}
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-cream/60">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
            <EditableText field="zone_note" value={content.zone_note} multiline />
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative">
            <ZoneMap />
            <span className="pointer-events-none absolute bottom-8 right-8 rounded-full bg-forest/90 px-4 py-2 text-xs font-medium tracking-wide text-cream shadow-lg backdrop-blur">
              Rayon de 20 km
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
