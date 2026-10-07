import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, CalendarCheck, Mail, Moon, Sun, Users, HeartHandshake, Home as HomeIcon, Sparkles } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/landing/Reveal";
import { Star4 } from "@/components/landing/Star";
import { EditableText } from "@/components/edit/EditableText";
import { useSiteContent } from "@/lib/content";

const CONCEPT_CARDS = [
  {
    icon: Moon,
    title: "Le ciel",
    text: "Les cycles lunaires, les saisons et les grands mouvements du ciel servent de fil conducteur et d'inspiration symbolique à chaque atelier.",
  },
  {
    icon: Sun,
    title: "Le souffle",
    text: "Respiration, relaxations dynamiques et visualisations positives : la sophrologie ancre ces inspirations dans le corps, simplement.",
  },
  {
    icon: Users,
    title: "Le cercle",
    text: "Un petit groupe bienveillant, à domicile ou en structure, pour partager une parenthèse hors du temps — sans aucune expérience requise.",
  },
];

const ATELIER_STEPS = [
  { title: "L'accueil du cercle", text: "Un temps d'arrivée en douceur, une tisane, et la présentation du thème céleste du moment." },
  { title: "L'exploration symbolique", text: "Une lecture accessible du cycle en cours — pleine lune, équinoxe, saison — et ce qu'il invite à vivre." },
  { title: "La pratique sophrologique", text: "Respirations et visualisation guidée en lien avec le thème, pour l'ancrer dans le corps." },
  { title: "Le partage & l'intégration", text: "Un cercle de parole pour déposer ses ressentis, et un petit rituel à emporter chez soi." },
];

export default function AstroSophroPage() {
  const content = useSiteContent();
  return (
    <div data-testid="astro-sophro-page">
      <Seo
        title="Astro-sophrologie — Ateliers alliant astrologie et sophrologie dans le Comminges (bientôt)"
        description="Bientôt à Mon Atelier Sophro : des ateliers d'astro-sophrologie dans le Comminges, alliant les cycles du ciel et les pratiques de sophrologie. Ateliers collectifs à domicile et en structures, 20 km autour d'Arguenos (31160). Katia Guijarro se forme actuellement à l'astrologie."
        keywords="astro-sophrologie, atelier astrologie sophrologie, atelier pleine lune, sophrologie cycles lunaires, atelier bien-être Comminges, astro sophro Arguenos 31160, atelier collectif relaxation Haute-Garonne"
        path="/astro-sophrologie"
      />

      <section className="relative overflow-hidden bg-forest pb-24 pt-[72px] lg:pb-32" data-testid="astro-hero">
        <img
          src="/photos/constellations.jpg"
          alt="Constellations scintillantes sur l'eau d'un ruisseau d'Arguenos"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/40 to-forest" />
        <motion.span
          aria-hidden="true"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="absolute left-[12%] top-32 text-etoile"
        >
          <Star4 className="h-6 w-6" />
        </motion.span>
        <motion.span
          aria-hidden="true"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 5.5, delay: 1.4, ease: "easeInOut" }}
          className="absolute right-[15%] top-48 text-etoile"
        >
          <Star4 className="h-4 w-4" />
        </motion.span>
        <motion.span
          aria-hidden="true"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 6, delay: 0.7, ease: "easeInOut" }}
          className="absolute bottom-24 left-[20%] text-etoile-soft"
        >
          <Star4 className="h-3.5 w-3.5" />
        </motion.span>

        <div className="relative mx-auto max-w-4xl px-5 pt-20 text-center sm:px-8 lg:pt-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-etoile/40 bg-etoile/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-etoile-soft">
              <Sparkles className="h-3.5 w-3.5" />
              Bientôt à l'atelier
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 font-serif text-3xl leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
              <EditableText field="astro_title" value={content.astro_title} />
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/80 sm:text-lg">
              <EditableText field="astro_intro" value={content.astro_intro} multiline />
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                data-testid="astro-notify-button"
                className="inline-flex items-center gap-2 rounded-full bg-etoile px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-etoile-soft"
              >
                <Mail className="h-4 w-4" />
                Être informée du lancement
              </Link>
              <Link
                to="/prestations"
                data-testid="astro-services-button"
                className="group inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-sm font-medium text-cream transition-colors duration-300 hover:bg-cream/10"
              >
                Découvrir les séances actuelles
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8" data-testid="astro-concept">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">Le concept</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Deux sagesses, une seule parenthèse
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CONCEPT_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <article className="h-full rounded-3xl border border-border bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-etoile/60 hover:shadow-xl hover:shadow-etoile/10">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-etoile/15">
                  <card.icon className="h-6 w-6 text-terracotta" />
                </span>
                <h3 className="mt-5 font-serif text-xl text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{card.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand/50 py-24" data-testid="astro-atelier">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">Comment se déroulera un atelier</p>
              <h2 className="mt-3 font-serif text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
                Une soirée entre ciel et souffle
              </h2>
              <div className="mt-8 space-y-6">
                {ATELIER_STEPS.map((step, i) => (
                  <div key={step.title} className="flex gap-5" data-testid={`astro-step-${i + 1}`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-etoile/60 bg-white font-serif text-terracotta">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg text-ink">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="blob-frame overflow-hidden shadow-2xl shadow-forest/25">
                <img
                  src="/photos/village.webp"
                  alt="Le village d'Arguenos sous la neige, sous un ciel d'hiver étoilé"
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              {[
                { icon: HomeIcon, text: "Ateliers à domicile, entre ami·es ou en famille" },
                { icon: HeartHandshake, text: "Ateliers en structures : associations, EHPAD, entreprises" },
                { icon: CalendarCheck, text: "Cycles ponctuels ou réguliers, au rythme du ciel" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5">
                  <item.icon className="h-5 w-5 shrink-0 text-terracotta" />
                  <p className="text-sm text-ink-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8" data-testid="astro-cta">
        <Reveal>
          <Star4 className="mx-auto h-8 w-8 text-etoile" />
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-ink sm:text-2xl">
            <EditableText field="astro_note" value={content.astro_note} multiline />
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              data-testid="astro-cta-contact"
              className="rounded-full bg-forest px-8 py-4 text-sm font-medium text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-sage-deep"
            >
              Écrire à Katia
            </Link>
            <Link
              to="/rendez-vous"
              data-testid="astro-cta-booking"
              className="rounded-full border border-terracotta/40 px-8 py-4 text-sm font-medium text-terracotta transition-colors duration-300 hover:bg-terracotta/5"
            >
              Réserver une séance de sophrologie
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
