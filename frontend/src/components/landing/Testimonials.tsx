import { Star, Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteContent, useTestimonials } from "@/lib/content";
import { EditableText } from "@/components/edit/EditableText";

export function Testimonials() {
  const content = useSiteContent();
  const testimonials = useTestimonials();
  return (
    <section id="temoignages" data-testid="testimonials-section" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">Témoignages</p>
        <h2 className="mt-3 max-w-2xl font-serif text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
          <EditableText field="testimonials_title" value={content.testimonials_title} />
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial, i) => (
          <Reveal key={testimonial.id} delay={(i % 4) * 0.07}>
            <figure
              data-testid={`testimonial-card-${i}`}
              className="relative h-full rounded-3xl border border-border bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-sage-soft hover:shadow-xl hover:shadow-sage-deep/10"
            >
              <Quote className="absolute right-7 top-7 h-8 w-8 text-sage-light" aria-hidden="true" />
              <div className="flex gap-1" aria-label="5 étoiles sur 5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-etoile text-etoile" />
                ))}
              </div>
              <blockquote className="mt-5 leading-relaxed text-ink">« {testimonial.quote} »</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <span className="block font-serif text-base text-ink">{testimonial.author}</span>
                <span className="block text-sm text-ink-muted">{testimonial.context}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
