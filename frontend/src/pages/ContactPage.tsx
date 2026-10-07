import { Seo } from "@/components/Seo";
import { FaqContact } from "@/components/landing/FaqContact";
import { CtaBand } from "@/components/landing/CtaBand";

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact — Mon Atelier Sophto, sophrologue itinérante (Arguenos 31160)"
        description="Contactez Katia Guijarro, sophrologue itinérante : téléphone, e-mail et réponses aux questions fréquentes (remboursement mutuelles, matériel, fréquence des séances, déplacement). Réponse sous 24 h, du lundi au samedi. 20 km autour d'Arguenos, Comminges."
        keywords="contact sophrologue Comminges, téléphone sophrologue Arguenos, FAQ sophrologie, mutuelle remboursement sophrologie, sophrologue près de chez moi 31160"
        path="/contact"
      />
      <div className="pt-[72px]">
        <FaqContact />
        <CtaBand />
      </div>
    </>
  );
}
