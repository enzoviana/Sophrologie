import { useEffect } from "react";

export const SITE_NAME = "Mon Atelier Sophro";
export const SITE_URL = "https://sophrologie-landing-1.preview.emergentagent.com";

export const LOCAL_KEYWORDS =
  "sophrologue à domicile, sophrologie Comminges, sophrologue Arguenos 31160, sophrologue Aspet, sophrologue Saint-Gaudens, sophrologue Salies-du-Salat, sophrologue Haute-Garonne, sophrologie Occitanie, gestion du stress, troubles du sommeil, sophrologie enfant, relaxation à domicile";

interface SeoProps {
  title: string;
  description: string;
  keywords?: string;
  path: string;
  noindex?: boolean;
}

export function Seo({ title, description, keywords, path, noindex = false }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (key: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords ? `${keywords}, ${LOCAL_KEYWORDS}` : LOCAL_KEYWORDS);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", `${SITE_URL}${path}`, "property");
    setMeta("og:type", "website", "property");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}${path}`;
  }, [title, description, keywords, path, noindex]);

  return null;
}
