import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { Star, ArrowRight, Home as HomeIcon } from "lucide-react";
import { resolveImage, useSiteContent } from "@/lib/content";
import { useEditMode } from "@/lib/editMode";
import { EditableText } from "@/components/edit/EditableText";
import { EditableImage } from "@/components/edit/EditableImage";
import { Star4 } from "./Star";

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1500259783852-0ca9ce8a64dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHw0fHxzb3Bocm9sb2d5JTIwbWVkaXRhdGlvbiUyMHdvbWFuJTIwbmF0dXJlfGVufDB8fHx8MTc5MTAzOTAxNHww&ixlib=rb-4.1.0&q=85";

export function Hero() {
  const content = useSiteContent();
  const { enabled } = useEditMode();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const titleFields: Array<{ field: "hero_line1" | "hero_line3"; value: string } | null> = [
    { field: "hero_line1", value: content.hero_line1 },
    null,
    { field: "hero_line3", value: content.hero_line3 },
  ];

  return (
    <section ref={sectionRef} data-testid="hero-section" className="relative overflow-hidden pt-[72px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-15%] h-[42rem] w-[42rem] rounded-full bg-sage-light blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[30rem] w-[30rem] rounded-full bg-sand blur-3xl"
      />
      <motion.span
        aria-hidden="true"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute right-[12%] top-28 hidden text-etoile md:block"
      >
        <Star4 className="h-7 w-7" />
      </motion.span>
      <motion.span
        aria-hidden="true"
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ repeat: Infinity, duration: 5.5, delay: 1, ease: "easeInOut" }}
        className="absolute left-[4%] top-1/2 hidden text-etoile md:block"
      >
        <Star4 className="h-4 w-4" />
      </motion.span>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:pb-28 lg:pt-20">
        <motion.div style={{ y: textY }} className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep"
          >
            <EditableText field="hero_surtitre" value={content.hero_surtitre} />
          </motion.p>

          <h1 className="font-serif text-4xl leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {titleFields.map((line, i) => (
              <span key={i} className={`block pb-1 ${enabled ? "" : "overflow-hidden"}`}>
                <motion.span
                  className="block"
                  initial={enabled ? false : { y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, delay: 0.25 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  {i === 1 ? (
                    <>
                      <em className="font-serif italic text-terracotta">
                        <EditableText field="hero_line2_accent" value={content.hero_line2_accent} />
                      </em>
                      <EditableText field="hero_line2_rest" value={content.hero_line2_rest} />
                    </>
                  ) : (
                    line && <EditableText field={line.field} value={line.value} />
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-6 text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            <EditableText field="hero_paragraph" value={content.hero_paragraph} multiline />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/rendez-vous"
              data-testid="hero-booking-button"
              className="rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-sage-deep hover:shadow-lg hover:shadow-sage-deep/25"
            >
              Réserver ma séance à domicile
            </Link>
            <Link
              to="/a-propos"
              data-testid="hero-discover-button"
              className="group flex items-center gap-2 rounded-full border border-terracotta/40 px-7 py-3.5 text-sm font-medium text-terracotta transition-all duration-300 hover:border-terracotta hover:bg-terracotta/5"
            >
              Découvrir la méthode
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-10 flex items-center gap-3"
            data-testid="hero-rating-badge"
          >
            <div className="flex" aria-label={content.hero_rating}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-etoile text-etoile" />
              ))}
            </div>
            <p className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">
                <EditableText field="hero_rating" value={content.hero_rating} />
              </span>{" "}
              — <EditableText field="hero_rating_text" value={content.hero_rating_text} />
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <motion.div style={{ y: imageY }} className="relative">
            <div className="blob-frame overflow-hidden shadow-2xl shadow-terracotta/20">
              <EditableImage
                field="hero_image"
                path={content.hero_image}
                fallback={FALLBACK_HERO_IMAGE}
                alt="Grand arbre au cœur du village d'Arguenos, racines de Mon Atelier Sophro"
                className="aspect-[4/5] w-full object-cover"
                eager
              />
            </div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-sage-soft bg-white/90 px-5 py-4 shadow-xl shadow-sage-deep/10 backdrop-blur-md sm:-left-10"
              data-testid="hero-floating-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-light">
                <HomeIcon className="h-5 w-5 text-sage-deep" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">Séances à domicile</span>
                <span className="block text-xs text-ink-muted">20 km autour d'Arguenos</span>
              </span>
            </motion.div>
            <motion.span
              aria-hidden="true"
              animate={{ scale: [1, 1.35, 1], rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-5 right-8 text-etoile"
            >
              <Star4 className="h-9 w-9 drop-shadow-lg" />
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
