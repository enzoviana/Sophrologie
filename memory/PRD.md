# PRD — Mon Atelier Sophto

## Problème initial (verbatim)
« Créer une page d'atterrissage : pour une sophrologist itinerante il faut une belle vitrine, un systeme de prise de rendez vous pour le moment seul la landing page sera realisé et le frontend pas de backend je veux une premiere maquette a presenter a ma Cliente »

Évolutions demandées ensuite : menu burger mobile, renommage « Mon Atelier Sophto » (Katia Guijarro reste la sophrologue), espace admin complet (sidebar, dashboard, clients, rendez-vous confirmables, paramètres de réservation configurables, calendrier jour/semaine/mois, services CRUD, page paramètres avec photo de profil), puis CMS complet (textes, images, témoignages, FAQ éditables par l'admin).

## Cliente & contexte
- Katia Guijarro, sophrologue itinérante certifiée
- Zone : 20 km autour d'Arguenos, 31160, Comminges (Occitanie)
- Site vitrine + prise de RDV en ligne avec validation manuelle par Katia

## Personas
- **Katia (admin)** : gère ses RDV, services, contenu du site, profil — non technique, tout doit être simple
- **Visiteuse/visiteur** : découvre la sophrologie à domicile, réserve un créneau sans compte

## Architecture
- Frontend : Vite + React 19 + TS strict, Tailwind v4, shadcn/base-ui, motion (framer), lenis (smooth scroll), TanStack Query
- Backend : FastAPI + motor (MongoDB), JWT en cookies httpOnly (access 12h / refresh 7j), bcrypt, anti brute-force (5 échecs → 15 min)
- Uploads : Emergent Object Storage (photo profil + images de contenu), servis via /api/files/{path}
- Design : sauge #8FA98F / crème #FAF7F2 / forêt #243E2B / terracotta #C87D55 — Lora (titres) + DM Sans (texte)

## Implémenté
- 2026-10-03 : Landing award-level (hero cinétique avec reveal masqué ligne par ligne, marquee éditorial, à propos bento, prestations, déroulé 4 étapes, zone 20 km avec communes, témoignages, réservation 3 étapes, FAQ accordéon, footer). Menu burger mobile avec volet animé.
- 2026-10-03 : Full-stack — auth admin, services en base, réservation réelle avec disponibilités calculées (jours ouverts, horaires, pause entre RDV, max/jour), confirmation admin, fiches clients auto.
- 2026-10-04 : Espace admin complet (sidebar + volet mobile) : Dashboard (stats + file d'attente), Rendez-vous (filtres + confirmer/refuser + paramètres de réservation), Calendrier (jour/semaine/mois), Clients, Services CRUD, Paramètres (profil + photo).
- 2026-10-04 : CMS — page « Contenu du site » (tous les textes des sections + images hero/à propos/zone uploadables), pages Témoignages et FAQ en CRUD libre. Landing entièrement alimentée par /api/content avec repli statique.
- 2026-10-04 : Site multi-pages (fini la single landing) : Accueil, Prestations, Prestation détaillée (/prestations/:id), À propos, Rendez-vous (présélection via ?service=), Contact, 404 brandée. SEO par page : titres/descriptions/mots-clés locaux dynamiques, canonical, Open Graph, robots meta (noindex admin + 404), JSON-LD HealthAndBeautyBusiness avec areaServed (10 communes), robots.txt + sitemap.xml. Navigation par routes React Router (navbar + volet burger + footer), Lenis déplacé dans le layout public, scroll-to-top au changement de page.
- 2026-10-04 : Congés & fermetures (plages de dates bloquantes, réservation refusée automatiquement + message « en congé ») et replanification de RDV côté admin (dialogue calendrier + créneaux, exclusion du RDV déplacé du calcul d'occupation).
- 2026-10-05 : REBRANDING RÉEL d'après les éléments de Katia — vrai logo hippocampe (PDF → PNG transparent + favicon hippocampe), nom corrigé « Mon Atelier Sophro » (le logo dit Sophro, pas Sophto), palette bleu hippocampe #2B618F + jaune étoiles #E6B432 + verts conservés, étoiles scintillantes animées, vraies photos (arbre d'Arguenos en hero, portrait de Katia en à propos + photo de profil admin, constellations dans l'eau pour le bandeau astro-sophro), vraie histoire (burn-out → bilan de compétences → lancement 17/09/2025, +20 ans d'accompagnement, astro-sophro en formation), « passionnée » au lieu de « certifiée », Moncaup ajouté, mentions légales réelles (Incubatest BGE SIRET 424 845 949 001 16, tél 05 61 61 45 15, Katia 06 72 11 11 53, Association Altitude Toulouse). Identifiants admin renommés : katia@monateliersophro.fr / AtelierSophro2026!.
- 2026-10-05 : CMS VISUEL EN DIRECT — barre d'édition flottante pour l'admin connectée sur le site public, édition de texte en ligne (clic → modification → enregistrement), remplacement d'images par survol, réorganisation des sections de l'accueil en drag & drop (dnd-kit, ordre persisté dans sections_order).

## Identifiants de démo
- /admin/login — katia@monateliersophto.fr / AtelierSophto2026! (voir memory/test_credentials.md)

## Backlog priorisé
- P0 : Présenter à Katia, recueillir ses retours ; remplacer les photos génériques par ses vraies photos (CMS prêt)
- P1 : Domaine personnalisé + soumettre le sitemap dans Google Search Console (robots.txt/sitemap.xml pointent vers l'URL de prévisualisation — à mettre à jour avec le vrai domaine)
- P1 : Prerendering/SSR (react-snap ou migration) pour un SEO Google encore plus fort — les balises sont actuellement posées côté client
- P1 : Notifications e-mail à Katia à chaque demande de RDV (Resend) ; e-mail de confirmation au client
- P1 : Modification/replanification d'un RDV (changer date/heure côté admin)
- P2 : Rappels automatiques la veille (tâche planifiée)
- P2 : Notes par cliente (champ notes déjà en base, pas encore d'UI)
- P2 : Pages Mentions légales / Confidentialité réelles
- P2 : Mode vacances (bloquer une plage de dates)

## Prochaines tâches
1. Présenter la maquette à Katia et recueillir ses retours (textes, tarifs, vraies photos)
2. Brancher les notifications e-mail (Resend, clé managée Emergent)
3. Ajouter l'édition d'un RDV existant (date/heure)
