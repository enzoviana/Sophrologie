import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Booking } from "@/components/landing/Booking";

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState<string | null>(searchParams.get("service"));

  return (
    <>
      <Seo
        title="Prendre rendez-vous — Séance de sophrologie à domicile en ligne"
        description="Réservez en ligne votre séance de sophrologie à domicile : choisissez la prestation, la date et l'horaire. Katia Guijarro se déplace dans un rayon de 20 km autour d'Arguenos (31160), Aspet, Saint-Gaudens, Salies-du-Salat. Confirmation personnelle sous 24 h."
        keywords="réserver sophrologue en ligne, rendez-vous sophrologie à domicile, prise de rendez-vous sophrologue Comminges, séance sophrologie Arguenos 31160"
        path="/rendez-vous"
      />
      <div className="pt-[72px]">
        <Booking selectedService={selectedService} onSelectService={setSelectedService} />
      </div>
    </>
  );
}
