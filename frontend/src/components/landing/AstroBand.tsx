import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Star4 } from "./Star";

export function AstroBand() {
  return (
    <section data-testid="astro-band-section" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-forest shadow-2xl shadow-forest/30">
          <img
            src="/photos/constellations.jpg"
            alt="Reflets scintillants comme des constellations sur l'eau d'un ruisseau d'Arguenos"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            loading="lazy"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-forest/35" />
          <motion.span
            aria-hidden="true"
            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute left-8 top-8 text-etoile"
          >
            <Star4 className="h-6 w-6" />
          </motion.span>
          <motion.span
            aria-hidden="true"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 5, delay: 1.2, ease: "easeInOut" }}
            className="absolute bottom-10 right-10 text-etoile"
          >
            <Star4 className="h-4 w-4" />
          </motion.span>
          <div className="relative px-8 py-16 text-center sm:px-16 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-etoile-soft">Bientôt à l'atelier</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-2xl tracking-tight text-cream sm:text-3xl lg:text-4xl">
              L'astro-sophrologie lève doucement son regard vers les étoiles
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
              Katia se forme actuellement à l'astrologie — trois années d'étude — pour relier ciel et
              intérieur. Des ateliers d'astro-sophro verront le jour prochainement : c'est eux, les étoiles
              qui veillent sur l'hippocampe.
            </p>
            <Link
              to="/astro-sophrologie"
              data-testid="astro-band-link"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-etoile/50 px-6 py-3 text-sm font-medium text-etoile-soft transition-all duration-300 hover:bg-etoile/10"
            >
              Découvrir l'astro-sophrologie
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
