import { Seo } from "@/components/Seo";
import { Services } from "@/components/landing/Services";
import { CtaBand } from "@/components/landing/CtaBand";

export default function PrestationsPage() {
  return (
    <>
      <Seo
        title="Prestations & tarifs de sophrologie à domicile — Séances adultes, enfants, groupes"
        description="Séances de sophrologie à domicile dans le Comminges : séance individuelle 55 €, forfait Sérénité 5 séances 250 €, enfants & ados 45 €, groupes et entreprises sur devis. Déplacement inclus dans un rayon de 20 km autour d'Arguenos (31160)."
        keywords="tarifs sophrologie, séance sophrologie à domicile, forfait sophrologie, sophrologie enfant ado tarif, atelier sophrologie entreprise Comminges, prix sophrologue Haute-Garonne"
        path="/prestations"
      />
      <div className="pt-[72px]">
        <Services />
        <CtaBand />
      </div>
    </>
  );
}
