import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/landing/Reveal";

export default function MentionsLegalesPage() {
  return (
    <div className="pt-[72px]" data-testid="mentions-legales-page">
      <Seo
        title="Mentions légales"
        description="Mentions légales du site Mon Atelier Sophro — Katia Guijarro, sophrologue itinérante dans le Comminges (31160)."
        path="/mentions-legales"
        noindex
      />
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal>
          <h1 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">Mentions légales</h1>
        </Reveal>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-muted">
          <Reveal>
            <section>
              <h2 className="font-serif text-xl text-ink">Éditrice du site</h2>
              <p className="mt-3">
                <strong className="text-ink">Mon Atelier Sophro — Katia Guijarro</strong>
                <br />
                Sophrologue itinérante — séances à domicile dans un rayon de 20 km autour d'Arguenos (31160), Comminges, Haute-Garonne.
                <br />
                Téléphone : <a href="tel:+33672111153" className="text-sage-deep underline underline-offset-2">06 72 11 11 53</a>
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-serif text-xl text-ink">Structure d'accompagnement</h2>
              <p className="mt-3">
                Activité incubée par <strong className="text-ink">Incubatest BGE</strong> — n° SIRET 424 845 949 001 16
                <br />
                Téléphone : 05 61 61 45 15
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-serif text-xl text-ink">Adresse administrative</h2>
              <p className="mt-3">
                Association Altitude
                <br />
                3 chemin du Pigeonnier de la Cépière
                <br />
                31100 Toulouse
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-serif text-xl text-ink">Hébergement du site</h2>
              <p className="mt-3">Site conçu et hébergé via la plateforme Emergent.</p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-serif text-xl text-ink">Données personnelles</h2>
              <p className="mt-3">
                Les informations transmises via le formulaire de prise de rendez-vous (nom, téléphone, adresse) sont
                utilisées uniquement pour l'organisation des séances et ne sont ni cédées ni vendues. Vous pouvez
                demander leur consultation, rectification ou suppression à tout moment par téléphone ou e-mail.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-serif text-xl text-ink">Propriété intellectuelle</h2>
              <p className="mt-3">
                Le logo, les photographies et les textes de ce site sont la propriété de Mon Atelier Sophro.
                Toute reproduction sans autorisation est interdite.
              </p>
            </section>
          </Reveal>
        </div>

        <Reveal>
          <Link
            to="/"
            data-testid="mentions-back-home"
            className="mt-12 inline-flex items-center gap-2 rounded-full border border-sage-deep/30 px-6 py-3 text-sm font-medium text-sage-deep transition-colors hover:bg-sage-light"
          >
            Retour à l'accueil
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
