import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./api";
import { COMMUNES, FAQS, MARQUEE_ITEMS, TESTIMONIALS } from "@/components/landing/data";

export interface TimelineStep {
  title: string;
  duration: string;
  text: string;
}

export interface SiteContent {
  hero_surtitre: string;
  hero_line1: string;
  hero_line2_accent: string;
  hero_line2_rest: string;
  hero_line3: string;
  hero_paragraph: string;
  hero_rating: string;
  hero_rating_text: string;
  hero_image: string | null;
  marquee_items: string[];
  about_title: string;
  about_paragraph1: string;
  about_paragraph2: string;
  about_badges: string[];
  about_quote: string;
  about_quote_author: string;
  about_image: string | null;
  services_title: string;
  services_subtitle: string;
  timeline_title: string;
  timeline_steps: TimelineStep[];
  timeline_note: string;
  zone_title: string;
  zone_text: string;
  zone_note: string;
  zone_image: string | null;
  communes: string[];
  testimonials_title: string;
  booking_title: string;
  booking_subtitle: string;
  faq_title: string;
  contact_title: string;
  contact_phone: string;
  contact_email: string;
  contact_note: string;
  footer_line1: string;
  footer_line2: string;
  footer_line3: string;
  sections_order: string[];
  astro_title: string;
  astro_intro: string;
  astro_points: string[];
  astro_note: string;
  about_secondary_title: string;
  about_secondary_text: string;
  about_secondary_image: string | null;
}

export const DEFAULT_CONTENT: SiteContent = {
  hero_surtitre: "Sophrologue itinérante · Comminges & Pyrénées",
  hero_line1: "Retrouvez votre",
  hero_line2_accent: "souffle",
  hero_line2_rest: ", sans quitter",
  hero_line3: "votre maison.",
  hero_paragraph:
    "Katia se déplace chez vous, dans un rayon de 20 km autour d'Arguenos, pour des séances de sophrologie sur mesure : gestion du stress, sommeil, confiance en soi. Vous n'avez rien à préparer — juste à respirer.",
  hero_rating: "20+",
  hero_rating_text: "ans d'accompagnement individuel et de groupe",
  hero_image: null,
  marquee_items: MARQUEE_ITEMS,
  about_title: "Katia Guijarro, une sophrologie qui vient à vous",
  about_paragraph1:
    "Après un burn-out et un bilan de compétences, Katia s'est tournée vers ce qui l'anime depuis toujours : l'accompagnement. Elle lance son activité de sophrologie d'abord bénévolement, en mai 2025, puis officiellement le 17 septembre 2025 — séances individuelles et suivis, à domicile ou en distanciel, et ateliers collectifs en structures.",
  about_paragraph2:
    "Sophrologue passionnée, forte de plus de 20 ans d'accompagnement individuel et de groupe, elle prépare aujourd'hui une longue formation d'astrologie pour ouvrir bientôt des ateliers d'astro-sophrologie — d'où les étoiles qui veillent sur l'atelier.",
  about_badges: ["Sophrologue passionnée", "+ de 20 ans d'accompagnement individuel et de groupe", "Astro-sophrologie en formation"],
  about_quote:
    "« La sophrologie n'ajoute rien de plus à votre vie. Elle vous aide simplement à retrouver ce qui est déjà là : votre capacité à respirer, à relâcher, à habiter le moment. »",
  about_quote_author: "Katia Guijarro",
  about_image: null,
  services_title: "Des formules simples, le déplacement inclus",
  services_subtitle:
    "Toutes les séances ont lieu à votre domicile, sans frais de déplacement dans un rayon de 20 km autour d'Arguenos.",
  timeline_title: "Une heure suspendue, quatre temps doux",
  timeline_steps: [
    { title: "L'accueil & l'échange", duration: "15 min", text: "Un temps de parole pour poser votre besoin du jour, installer le cadre et la confiance." },
    { title: "Respiration & relaxations dynamiques", duration: "20 min", text: "Des mouvements doux guidés par la voix, pour relâcher les tensions du corps et apaiser le mental." },
    { title: "Visualisation positive guidée", duration: "15 min", text: "Confortablement installé·e, vous explorez une image ressource qui ancre le calme en profondeur." },
    { title: "Clôture & phénodescription", duration: "10 min", text: "Un retour en douceur, un échange sur vos ressentis et des exercices simples à refaire chez vous." },
  ],
  timeline_note: "Et le plus beau : une fois la séance terminée, vous restez chez vous. Pas de route, pas de stress — le calme continue.",
  zone_title: "20 km autour d'Arguenos, au cœur du Comminges",
  zone_text:
    "Des vallées de la Garonne aux premiers contreforts des Pyrénées, Katia parcourt les routes du Comminges pour vous rejoindre. Le déplacement est inclus dans le tarif — aucun frais caché.",
  zone_note: "Votre commune n'apparaît pas ? Contactez Katia — un déplacement au-delà de 20 km reste possible sur demande.",
  zone_image: null,
  communes: COMMUNES,
  testimonials_title: "Ils ont retrouvé leur calme, chez eux",
  booking_title: "Réservez votre séance à domicile",
  booking_subtitle:
    "Choisissez votre formule, votre créneau, et Katia vient à vous. Chaque demande est confirmée personnellement sous 24 h.",
  faq_title: "Tout ce que vous vous demandez",
  contact_title: "Une question, une envie ? Écrivez-lui",
  contact_phone: "06 72 11 11 53",
  contact_email: "contact@monateliersophro.fr",
  contact_note:
    "Katia vous répond sous 24 h, du lundi au samedi. Premier échange téléphonique gratuit et sans engagement, pour faire connaissance et poser votre besoin.",
  footer_line1: "Respirez.",
  footer_line2: "Ancrez-vous.",
  footer_line3: "Le reste peut attendre.",
  sections_order: ["about", "services", "timeline", "zone", "astro", "testimonials", "cta"],
  astro_title: "L'astro-sophrologie, quand le ciel rencontre le souffle",
  astro_intro:
    "Après sa formation de sophrologie, Katia poursuit son chemin vers les étoiles : elle se forme actuellement à l'astrologie — un long cursus de trois années — pour créer des ateliers uniques mêlant la lecture symbolique du ciel et les pratiques corporelles de la sophrologie.",
  astro_points: [
    "Ateliers collectifs à domicile ou en structures",
    "Des thèmes guidés par les cycles du ciel et les saisons",
    "Des pratiques de sophrologie adaptées à chacun",
  ],
  astro_note:
    "Katia est en cours de formation : les ateliers d'astro-sophrologie ouvriront prochainement. Contactez-la pour être informée du lancement.",
  about_secondary_title: "Un atelier itinérant, pensé pour vous",
  about_secondary_text:
    "Katia aménage son camping-car en véritable atelier de sophrologie mobile : un cocon calme et chaleureux qui se gare près de chez vous, pour vos séances individuelles comme pour les petits ateliers collectifs. L'atelier vient à vous, même là où il n'y a pas de cabinet.",
  about_secondary_image: null,
};

export interface TestimonialDto {
  id: string;
  quote: string;
  author: string;
  context: string;
}

export interface FaqDto {
  id: string;
  question: string;
  answer: string;
}

export const STATIC_TESTIMONIALS: TestimonialDto[] = TESTIMONIALS.map((t, i) => ({ id: `static-${i}`, ...t }));
export const STATIC_FAQS: FaqDto[] = FAQS.map((f, i) => ({ id: `static-${i}`, ...f }));

export function resolveImage(path: string | null | undefined, fallback: string): string {
  if (!path) return fallback;
  return path.startsWith("http") ? path : `/api/files/${path}`;
}

export function useSiteContent(): SiteContent {
  const { data } = useQuery({
    queryKey: ["site-content"],
    queryFn: () => apiGet<Partial<SiteContent>>("/content"),
    retry: false,
    staleTime: 60_000,
  });
  return { ...DEFAULT_CONTENT, ...(data ?? {}) };
}

export function useTestimonials(): TestimonialDto[] {
  const { data } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: () => apiGet<TestimonialDto[]>("/testimonials"),
    retry: false,
    staleTime: 60_000,
  });
  return data ?? STATIC_TESTIMONIALS;
}

export function useFaqs(): FaqDto[] {
  const { data } = useQuery({
    queryKey: ["public-faqs"],
    queryFn: () => apiGet<FaqDto[]>("/faqs"),
    retry: false,
    staleTime: 60_000,
  });
  return data ?? STATIC_FAQS;
}
