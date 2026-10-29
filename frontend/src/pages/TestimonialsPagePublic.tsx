import { Seo } from "@/components/Seo";
import { Testimonials } from "@/components/landing/Testimonials";
import { CtaBand } from "@/components/landing/CtaBand";

export default function TestimonialsPagePublic() {
  return (
    <>
      <Seo
        title="Témoignages — Ce qu'en disent mes clients"
        description="Découvrez les témoignages de clients satisfaits de Mon Atelier Sophto. Gestion du stress, troubles du sommeil, préparation aux examens, burn-out : ils partagent leur expérience avec la sophrologie à domicile dans le Comminges."
        keywords="témoignages sophrologie, avis client Katia Guijarro, sophrologie Comminges avis, retour expérience sophrologie"
        path="/temoignages"
      />
      <div className="pt-[72px]">
        <Testimonials />
        <CtaBand />
      </div>
    </>
  );
}
