import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { Reveal } from "./Reveal";

export function CtaBand() {
  return (
    <section data-testid="cta-band-section" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-32">
      <Reveal>
        <div className="rounded-3xl bg-forest px-8 py-14 text-center sm:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-soft">Prêt·e à souffler ?</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-2xl tracking-tight text-cream sm:text-3xl lg:text-4xl">
            Votre séance de sophrologie, directement chez vous
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/75 sm:text-base">
            Choisissez votre créneau en ligne : Katia confirme personnellement chaque demande sous 24 h,
            puis se déplace à votre domicile avec tout le nécessaire.
          </p>
          <Link
            to="/rendez-vous"
            data-testid="cta-band-booking-button"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracotta px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-hover"
          >
            <CalendarCheck className="h-4 w-4" />
            Réserver mon créneau
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
