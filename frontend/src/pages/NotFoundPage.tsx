import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-forest px-5 text-center text-cream" data-testid="not-found-page">
      <Seo title="Page introuvable (404)" description="Cette page n'existe pas ou a été déplacée." path="/404" noindex />
      <svg viewBox="0 0 48 48" className="h-16 w-16" aria-hidden="true">
        <circle cx="24" cy="24" r="21.5" fill="none" stroke="#C7D8C6" strokeWidth="2" />
        <path d="M9 27c4.2-8.6 9.2-12.9 15-12.9S34.8 18.4 39 27" fill="none" stroke="#8FA98F" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M14 32c3-5.4 6.2-8.1 10-8.1s7 2.7 10 8.1" fill="none" stroke="#C87D55" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <p className="mt-8 font-serif text-7xl tracking-tight text-sage-soft sm:text-8xl">404</p>
      <h1 className="mt-4 font-serif text-2xl tracking-tight sm:text-3xl">Cette page s'est évaporée</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/70">
        Prenez une grande inspiration… puis revenez vers un chemin plus apaisant.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          data-testid="not-found-home-link"
          className="rounded-full bg-terracotta px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-hover"
        >
          Retour à l'accueil
        </Link>
        <Link
          to="/rendez-vous"
          data-testid="not-found-booking-link"
          className="rounded-full border border-sage-soft/50 px-7 py-3.5 text-sm font-medium text-cream transition-colors duration-300 hover:bg-sage-deep"
        >
          Prendre rendez-vous
        </Link>
      </div>
    </div>
  );
}
