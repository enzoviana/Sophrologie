import { Seo } from "@/components/Seo";
import { About } from "@/components/landing/About";
import { CtaBand } from "@/components/landing/CtaBand";

export default function AboutPage() {
  return (
    <>
      <Seo
        title="À propos — Katia Guijarro, sophrologue passionnée et itinérante dans le Comminges"
        description="Après un burn-out et un bilan de compétences, Katia Guijarro a créé Mon Atelier Sophro : séances de sophrologie à domicile, en distanciel et ateliers collectifs dans le Comminges. Plus de 20 ans d'accompagnement individuel et de groupe. Bientôt : l'astro-sophrologie."
        keywords="Katia Guijarro sophrologue, sophrologue passionnée Comminges, astro-sophrologie, sophrologue itinérante Pyrénées, à propos sophrologue Arguenos"
        path="/a-propos"
      />
      <div className="pt-[72px]">
        <About />
        <CtaBand />
      </div>
    </>
  );
}
