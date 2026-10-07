import { MessagesSquare, Waves, Sparkles, Coffee } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteContent } from "@/lib/content";
import { EditableText } from "@/components/edit/EditableText";

const STEP_ICONS = [MessagesSquare, Waves, Sparkles, Coffee];

export function SessionTimeline() {
  const content = useSiteContent();
  return (
    <section id="deroule" data-testid="timeline-section" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">Le déroulé d'une séance</p>
        <h2 className="mt-3 max-w-2xl font-serif text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
          <EditableText field="timeline_title" value={content.timeline_title} />
        </h2>
      </Reveal>

      <div className="relative mt-16 grid gap-10 lg:grid-cols-4 lg:gap-6">
        <div
          aria-hidden="true"
          className="absolute left-6 top-0 h-full w-px bg-sage-soft lg:left-0 lg:top-7 lg:h-px lg:w-full"
        />
        {content.timeline_steps.map((step, i) => {
          const Icon = STEP_ICONS[i % STEP_ICONS.length];
          return (
            <Reveal key={i} delay={i * 0.1}>
              <div data-testid={`timeline-step-${i + 1}`} className="relative flex gap-6 pl-1 lg:block lg:pl-0">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sage-soft bg-cream font-serif text-lg text-sage-deep lg:mb-6 lg:h-14 lg:w-14">
                  {i + 1}
                </div>
                <div>
                  <Icon className="mb-3 h-5 w-5 text-terracotta" aria-hidden="true" />
                  <h3 className="font-serif text-lg leading-snug text-ink">{step.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-sage-deep">{step.duration}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{step.text}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-14 rounded-2xl border border-sage-soft bg-sage-light px-6 py-5 text-center text-sm leading-relaxed text-forest sm:text-base">
          <EditableText field="timeline_note" value={content.timeline_note} multiline />
        </p>
      </Reveal>
    </section>
  );
}
