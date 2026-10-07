interface LogoProps {
  dark?: boolean;
}

export function Logo({ dark = false }: LogoProps) {
  return (
    <a href="/" data-testid="logo-link" className="flex items-center gap-3" aria-label="Mon Atelier Sophro — Accueil">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ${dark ? "bg-white p-1 shadow-md" : ""}`}>
        <img src="/favicon.png" alt="Hippocampe de Mon Atelier Sophro" className="h-full w-full object-contain" />
      </span>
      <span className="leading-tight">
        <span className={`block font-serif text-lg tracking-tight ${dark ? "text-cream" : "text-ink"}`}>
          Mon Atelier Sophro
        </span>
        <span className={`block text-[10px] uppercase tracking-[0.22em] ${dark ? "text-sage-soft" : "text-sage-deep"}`}>
          par Katia Guijarro
        </span>
      </span>
    </a>
  );
}
