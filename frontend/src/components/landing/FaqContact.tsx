import { useState } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { Reveal } from "./Reveal";
import { useFaqs, useSiteContent } from "@/lib/content";

export function FaqContact() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const content = useSiteContent();
  const faqs = useFaqs();
  const telHref = `tel:${content.contact_phone.replace(/\s/g, "")}`;

  return (
    <section id="contact" data-testid="faq-contact-section" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">Questions fréquentes</p>
          <h2 className="mt-3 font-serif text-2xl tracking-tight text-ink sm:text-3xl">
            {content.faq_title}
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div key={faq.id} className="overflow-hidden rounded-2xl border border-border bg-white">
                  <button
                    data-testid={`faq-question-${i}`}
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-medium text-ink">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-sage-deep transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink-muted">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">Contact direct</p>
          <h2 className="mt-3 font-serif text-2xl tracking-tight text-ink sm:text-3xl">
            {content.contact_title}
          </h2>
          <div className="mt-8 space-y-4">
            <a
              data-testid="contact-phone-link"
              href={telHref}
              className="group flex items-center gap-5 rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-sage-soft hover:shadow-lg hover:shadow-sage-deep/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-light transition-colors duration-300 group-hover:bg-sage-soft">
                <Phone className="h-5 w-5 text-sage-deep" />
              </span>
              <span>
                <span className="block text-sm text-ink-muted">Par téléphone</span>
                <span className="block font-serif text-lg text-ink">{content.contact_phone}</span>
              </span>
            </a>
            <a
              data-testid="contact-email-link"
              href={`mailto:${content.contact_email}`}
              className="group flex items-center gap-5 rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-sage-soft hover:shadow-lg hover:shadow-sage-deep/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-light transition-colors duration-300 group-hover:bg-sage-soft">
                <Mail className="h-5 w-5 text-sage-deep" />
              </span>
              <span>
                <span className="block text-sm text-ink-muted">Par e-mail</span>
                <span className="block break-all font-serif text-lg text-ink">{content.contact_email}</span>
              </span>
            </a>
            <p className="rounded-2xl bg-sage-light px-6 py-5 text-sm leading-relaxed text-forest">
              {content.contact_note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
