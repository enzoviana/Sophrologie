import { Leaf, ShieldCheck, HeartHandshake, MapPinned, Bus } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteContent } from "@/lib/content";
import { useEditMode } from "@/lib/editMode";
import { EditableText } from "@/components/edit/EditableText";
import { EditableImage } from "@/components/edit/EditableImage";

const FALLBACK_ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1518708909080-704599b19972?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwyfHx3b21hbiUyMG1lZGl0YXRpbmclMjBicmVhdGhpbmclMjBuYXR1cmUlMjBjYWxtfGVufDB8fHx8MTc5MTAzOTA0N3ww&ixlib=rb-4.1.0&q=85";

const VALUES = [
  { icon: Leaf, title: "Douceur", text: "Une pratique sans jugement, à votre rythme." },
  { icon: MapPinned, title: "Ancrage", text: "Enracinée dans le Comminges et ses vallées." },
  { icon: ShieldCheck, title: "Confidentialité", text: "Un cadre de parole protégé, chez vous." },
  { icon: HeartHandshake, title: "Proximité", text: "Un accompagnement humain et de confiance." },
];

export function About() {
  const content = useSiteContent();
  const { enabled } = useEditMode();
  const showSecondary = content.about_secondary_image !== null || enabled;

  return (
    <section id="a-propos" data-testid="about-section" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">À propos</p>
        <h2 className="mt-3 max-w-2xl font-serif text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
          <EditableText field="about_title" value={content.about_title} />
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-5 lg:row-span-2" delay={0.05}>
          <div className="blob-frame-alt h-full min-h-[320px] overflow-hidden shadow-xl shadow-sage-deep/15">
            <EditableImage
              field="about_image"
              path={content.about_image}
              fallback={FALLBACK_ABOUT_IMAGE}
              alt="Katia Guijarro, sophrologue itinérante dans le Comminges"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.12}>
          <div className="h-full rounded-3xl border border-border bg-white p-8 sm:p-10">
            <p className="leading-relaxed text-ink-muted">
              <EditableText field="about_paragraph1" value={content.about_paragraph1} multiline />
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              <EditableText field="about_paragraph2" value={content.about_paragraph2} multiline />
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {content.about_badges.map((badge) => (
                <span key={badge} className="rounded-full bg-sage-light px-3.5 py-1.5 text-xs font-medium text-sage-deep">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={0.15 + i * 0.07}>
              <div
                data-testid={`about-value-${i}`}
                className="group h-full rounded-3xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sage-soft hover:shadow-lg hover:shadow-sage-deep/10"
              >
                <value.icon className="h-6 w-6 text-sage-deep transition-colors duration-300 group-hover:text-terracotta" />
                <h3 className="mt-4 font-serif text-lg text-ink">{value.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{value.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {showSecondary && (
        <Reveal delay={0.05}>
          <div className="mt-5 grid items-stretch gap-5 overflow-hidden rounded-3xl border border-border bg-white lg:grid-cols-2" data-testid="about-itinerant-section">
            <div className="relative min-h-[280px]">
              <EditableImage
                field="about_secondary_image"
                path={content.about_secondary_image}
                fallback=""
                alt="Le camping-car aménagé de Katia, atelier de sophrologie itinérant"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-light">
                <Bus className="h-6 w-6 text-sage-deep" />
              </span>
              <h3 className="mt-5 font-serif text-2xl tracking-tight text-ink">
                <EditableText field="about_secondary_title" value={content.about_secondary_title} />
              </h3>
              <p className="mt-4 leading-relaxed text-ink-muted">
                <EditableText field="about_secondary_text" value={content.about_secondary_text} multiline />
              </p>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <blockquote className="mt-5 rounded-3xl bg-forest p-10 text-center sm:p-14">
          <p className="mx-auto max-w-2xl font-serif text-xl italic leading-relaxed text-cream sm:text-2xl">
            {content.about_quote}
          </p>
          <footer className="mt-6 text-sm uppercase tracking-[0.2em] text-sage-soft">{content.about_quote_author}</footer>
        </blockquote>
      </Reveal>
    </section>
  );
}
