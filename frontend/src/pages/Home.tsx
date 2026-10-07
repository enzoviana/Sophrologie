import { Fragment, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { AboutTeaser } from "@/components/landing/AboutTeaser";
import { Services } from "@/components/landing/Services";
import { SessionTimeline } from "@/components/landing/SessionTimeline";
import { Zone } from "@/components/landing/Zone";
import { AstroBand } from "@/components/landing/AstroBand";
import { Testimonials } from "@/components/landing/Testimonials";
import { CtaBand } from "@/components/landing/CtaBand";
import { useEditMode } from "@/lib/editMode";
import { useSiteContent } from "@/lib/content";
import { apiPut } from "@/lib/api";
import { formatApiError } from "@/lib/auth";
import { toast } from "sonner";

const SECTION_META: Record<string, string> = {
  about: "À propos",
  services: "Prestations",
  timeline: "Déroulé d'une séance",
  zone: "Zone d'intervention",
  astro: "Astro-sophrologie",
  testimonials: "Témoignages",
  cta: "Appel à l'action",
};

function SortableSection({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative ${isDragging ? "z-40 opacity-75 shadow-2xl" : ""}`}
      data-testid={`sortable-section-${id}`}
    >
      <button
        {...attributes}
        {...listeners}
        data-testid={`section-drag-${id}`}
        className="absolute left-4 top-4 z-30 flex cursor-grab items-center gap-2 rounded-full bg-etoile px-4 py-2 text-xs font-semibold text-ink shadow-lg transition-transform hover:scale-105 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
        {SECTION_META[id]}
      </button>
      <div className="outline-dashed outline-2 -outline-offset-2 outline-etoile/50">{children}</div>
    </div>
  );
}

export default function Home() {
  const content = useSiteContent();
  const { enabled } = useEditMode();
  const queryClient = useQueryClient();

  const sectionNodes: Record<string, ReactNode> = {
    about: <AboutTeaser />,
    services: <Services />,
    timeline: <SessionTimeline />,
    zone: <Zone />,
    astro: <AstroBand />,
    testimonials: <Testimonials />,
    cta: <CtaBand />,
  };

  const stored = (content.sections_order ?? []).filter((k) => k in SECTION_META);
  const order = [...stored, ...Object.keys(SECTION_META).filter((k) => !stored.includes(k))];

  const reorder = useMutation({
    mutationFn: (newOrder: string[]) => apiPut("/content", { sections_order: newOrder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Ordre des sections enregistré");
    },
    onError: (err) => toast.error(formatApiError(err)),
  });

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder.mutate(arrayMove(order, order.indexOf(String(active.id)), order.indexOf(String(over.id))));
    }
  };

  return (
    <>
      <Seo
        title="Sophrologue à domicile dans le Comminges — Arguenos, Aspet, Saint-Gaudens"
        description="Mon Atelier Sophro : Katia Guijarro, sophrologue passionnée et itinérante, se déplace à votre domicile dans un rayon de 20 km autour d'Arguenos (31160). Gestion du stress, sommeil, confiance en soi, enfants et adultes. Bientôt : ateliers d'astro-sophrologie. Réservez votre séance en ligne."
        keywords="sophrologue à domicile Comminges, sophrologie Arguenos 31160, sophrologue Aspet, sophrologue Saint-Gaudens, sophrologue Salies-du-Salat, sophrologie itinérante Haute-Garonne, gestion du stress Comminges, sophrologie sommeil, sophrologie enfant ado, astro-sophrologie"
        path="/"
      />
      <Hero />
      <Marquee />
      {enabled ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            {order.map((key) => (
              <SortableSection key={key} id={key}>
                {sectionNodes[key]}
              </SortableSection>
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        order.map((key) => <Fragment key={key}>{sectionNodes[key]}</Fragment>)
      )}
    </>
  );
}
