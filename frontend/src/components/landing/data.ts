export interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

export const SERVICES: Service[] = [
  {
    id: "individuelle",
    name: "Séance individuelle",
    duration: "1 h",
    price: "55 €",
    description: "Un temps rien qu'à vous, à votre rythme, dans le confort de votre maison.",
    features: ["Entretien personnalisé", "Respiration & relaxations dynamiques", "Visualisation positive guidée"],
  },
  {
    id: "forfait-serenite",
    name: "Forfait Sérénité",
    duration: "5 séances",
    price: "250 €",
    priceNote: "soit 50 € la séance",
    description: "Le cheminement complet pour ancrer durablement les bienfaits de la sophrologie.",
    features: ["Suivi progressif sur 5 semaines", "Carnet offert", "Priorité sur les créneaux"],
    highlight: true,
  },
  {
    id: "enfants-ados",
    name: "Enfants & ados",
    duration: "45 min",
    price: "45 €",
    description: "Gestion des émotions, confiance en soi, préparation des examens, en douceur.",
    features: ["Approche ludique et adaptée", "Parent présent si souhaité", "Outils réutilisables à l'école"],
  },
  {
    id: "groupes",
    name: "Groupes & entreprises",
    duration: "sur mesure",
    price: "Sur devis",
    description: "Ateliers collectifs, gestion du stress au travail, séances en petits groupes.",
    features: ["Comités d'entreprise, associations", "Jusqu'à 10 personnes", "Déplacement dans tout le Comminges"],
  },
];

export const NAV_LINKS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/prestations", label: "Prestations", end: false },
  { to: "/a-propos", label: "À propos", end: false },
  { to: "/astro-sophrologie", label: "Astro-sophro", end: false },
  { to: "/contact", label: "Contact", end: false },
];

export const COMMUNES = [
  "Arguenos",
  "Aspet",
  "Salies-du-Salat",
  "Saint-Gaudens",
  "Moncaup",
  "Arbas",
  "Cazaunous",
  "Sengouagnet",
  "Juzet-d'Izaut",
  "Saint-Béat",
  "Montréjeau",
  "Encausse-les-Thermes",
  "Cazaux-Layrisse",
];

export const MARQUEE_ITEMS = [
  "Gestion du stress",
  "Sommeil réparateur",
  "Respiration contrôlée",
  "Écoute bienveillante",
  "À domicile · 20 km",
  "Enfants & adultes",
  "Astro-sophro bientôt",
  "Préparation mentale",
];

export interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Après quelques séances, mes crises d'angoisse se sont espacées. Katia vient chez moi, je suis dans mon cocon, tout devient plus simple.",
    author: "Marie L.",
    context: "Gestion de l'anxiété · Aspet",
  },
  {
    quote: "Je dormais mal depuis des années. Les exercices de respiration du soir ont tout changé. Une approche douce, jamais intrusive.",
    author: "Thomas R.",
    context: "Troubles du sommeil · Saint-Gaudens",
  },
  {
    quote: "Ma fille préparait son bac et n'arrivait plus à gérer la pression. Elle a abordé les épreuves avec un calme que je ne lui connaissais pas.",
    author: "Sophie D.",
    context: "Préparation aux examens · Salies-du-Salat",
  },
  {
    quote: "En plein burn-out, je n'avais plus la force de me déplacer. La séance à domicile, sans avoir à reprendre la voiture après, c'est précieux.",
    author: "Nathalie B.",
    context: "Accompagnement burn-out · Arbas",
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "Les séances sont-elles remboursées ?",
    answer: "La sophrologie n'est pas prise en charge par la Sécurité sociale, mais de nombreuses mutuelles remboursent tout ou partie des séances. Une facture vous est remise après chaque rendez-vous.",
  },
  {
    question: "Faut-il du matériel particulier chez moi ?",
    answer: "Non. Une chaise, un fauteuil ou un tapis suffisent, avec un espace calme d'environ 2 m². La séance s'adapte à votre intérieur, simplement.",
  },
  {
    question: "Quelle fréquence est recommandée ?",
    answer: "Pour un objectif précis, une séance par semaine pendant 4 à 5 semaines donne les meilleurs résultats, puis un rythme d'entretien mensuel. Chaque parcours reste adapté à vos besoins.",
  },
  {
    question: "Vous déplacez-vous vraiment partout ?",
    answer: "Oui, dans un rayon de 20 km autour d'Arguenos (31160), sans frais supplémentaires. Au-delà, un déplacement reste possible sur simple demande, avec un léger supplément kilométrique.",
  },
];
