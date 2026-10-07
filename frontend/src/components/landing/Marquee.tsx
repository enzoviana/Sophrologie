import { Star4 } from "./Star";
import { useSiteContent } from "@/lib/content";

export function Marquee() {
  const content = useSiteContent();
  const items = [...content.marquee_items, ...content.marquee_items];
  return (
    <div data-testid="editorial-marquee" className="overflow-hidden border-y border-sage-soft/60 bg-sage-light py-5">
      <div className="animate-marquee flex w-max items-center">
        {items.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="whitespace-nowrap font-serif text-lg italic text-forest/80">{item}</span>
            <Star4 className="mx-8 h-4 w-4 shrink-0 text-etoile" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
