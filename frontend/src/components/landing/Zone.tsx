import { MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { resolveImage, useSiteContent } from "@/lib/content";
import { EditableText } from "@/components/edit/EditableText";
import { EditableImage } from "@/components/edit/EditableImage";

const FALLBACK_ZONE_IMAGE =
  "https://images.unsplash.com/photo-1694961585324-2e1162cc45f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHw0fHxweXJlbmVlcyUyMG1vdW50YWlucyUyMGxhbmRzY2FwZSUyMGZyYW5jZXxlbnwwfHx8fDE3OTEwMzkwMTR8MA&ixlib=rb-4.1.0&q=85";

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
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/30">
            <EditableImage
              field="zone_image"
              path={content.zone_image}
              fallback={FALLBACK_ZONE_IMAGE}
              alt="Vallées verdoyantes des Pyrénées commingeoises"
              className="aspect-[4/3] w-full object-cover"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-forest/25" />
            <svg
              aria-hidden="true"
              viewBox="0 0 400 300"
              className="pointer-events-none absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <circle cx="200" cy="150" r="115" fill="none" stroke="#FAF7F2" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 6" />
              <circle cx="200" cy="150" r="60" fill="none" stroke="#FAF7F2" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 6" />
            </svg>
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta shadow-lg shadow-black/30 ring-4 ring-cream/40">
                <MapPin className="h-6 w-6 text-white" />
              </span>
              <span className="mt-2 rounded-full bg-cream/95 px-4 py-1.5 text-xs font-semibold text-forest shadow">
                Arguenos · 31160
              </span>
            </div>
            <span className="pointer-events-none absolute bottom-4 right-5 rounded-full bg-forest/80 px-4 py-1.5 text-xs font-medium tracking-wide text-cream backdrop-blur">
              Rayon de 20 km
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
