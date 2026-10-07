import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { resolveImage, useSiteContent } from "@/lib/content";
import { EditableText } from "@/components/edit/EditableText";
import { EditableImage } from "@/components/edit/EditableImage";

const FALLBACK_ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1518708909080-704599b19972?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwyfHx3b21hbiUyMG1lZGl0YXRpbmclMjBicmVhdGhpbmclMjBuYXR1cmUlMjBjYWxtfGVufDB8fHx8MTc5MTAzOTA0N3ww&ixlib=rb-4.1.0&q=85";

export function AboutTeaser() {
  const content = useSiteContent();
  return (
    <section data-testid="about-teaser-section" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="blob-frame-alt overflow-hidden shadow-xl shadow-sage-deep/15">
            <EditableImage
              field="about_image"
              path={content.about_image}
              fallback={FALLBACK_ABOUT_IMAGE}
              alt="Katia Guijarro, sophrologue itinérante dans le Comminges"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">À propos</p>
          <h2 className="mt-3 font-serif text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
            <EditableText field="about_title" value={content.about_title} />
          </h2>
          <p className="mt-5 leading-relaxed text-ink-muted">
            <EditableText field="about_paragraph1" value={content.about_paragraph1} multiline />
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {content.about_badges.map((badge) => (
              <span key={badge} className="rounded-full bg-sage-light px-3.5 py-1.5 text-xs font-medium text-sage-deep">
                {badge}
              </span>
            ))}
          </div>
          <Link
            to="/a-propos"
            data-testid="about-teaser-link"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-colors hover:text-terracotta-hover"
          >
            Découvrir mon parcours et ma philosophie
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
