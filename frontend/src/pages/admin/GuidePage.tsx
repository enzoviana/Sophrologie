import { useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CircleHelp,
  FileText,
  GripVertical,
  Leaf,
  Palette,
  Quote,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Users,
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

function CollapsibleSection({ section, defaultOpen = false }: { section: GuideSection; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = section.icon;

  return (
    <div className="rounded-2xl border-2 border-sage-soft bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-sage-light/30"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-light text-sage-deep">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="font-serif text-xl text-ink">{section.title}</h2>
        </div>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-ink-muted" />
        ) : (
          <ChevronRight className="h-5 w-5 text-ink-muted" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-sage-soft/50 bg-cream/30 p-6">
          {section.content}
        </div>
      )}
    </div>
  );
}

export default function GuidePage() {
  const sections: GuideSection[] = [
    {
      id: "services",
      title: "Services & Prestations",
      icon: Leaf,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Gérez l'ensemble de vos prestations affichées sur le site et dans le formulaire de réservation.
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold text-ink flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-sage-deep" />
              Réorganiser l'ordre des services
            </h3>
            <div className="rounded-xl bg-white p-4 border border-sage-soft">
              <ol className="space-y-2 text-sm text-ink-muted">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">1</span>
                  <span>Allez sur la page <strong className="text-ink">Services</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">2</span>
                  <span>Cliquez et maintenez la poignée <strong className="text-ink">⋮⋮</strong> à gauche de chaque carte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">3</span>
                  <span>Glissez la carte vers le haut ou le bas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">4</span>
                  <span>Relâchez - l'ordre est automatiquement enregistré !</span>
                </li>
              </ol>
            </div>

            <h3 className="font-semibold text-ink mt-6">Créer un nouveau service</h3>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span>Cliquez sur le bouton <strong className="text-ink">"Nouveau service"</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span>Remplissez le nom, la description, le prix et la durée</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span>Ajoutez des points forts (un par ligne)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span>Cochez "Mettre en avant" pour l'afficher avec un badge spécial</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span>Décochez "Visible et réservable" pour masquer du site</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "theme",
      title: "Thème & Couleurs",
      icon: Palette,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Personnalisez l'apparence de votre site en choisissant parmi 5 palettes ou en créant la vôtre.
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold text-ink">Palettes pré-définies</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: "Sauge & Forêt", desc: "Vert naturel (actuel)", colors: ["#E9EFE7", "#8FA98F", "#4E6B50", "#243E2B"] },
                { name: "Méditerranée", desc: "Bleu océan + jaune", colors: ["#E8F4F8", "#6BA8C4", "#2E7D96", "#E89F3C"] },
                { name: "Fraîcheur Vitaminée", desc: "Turquoise vif", colors: ["#E8F8F5", "#52C9B3", "#1ABC9C", "#F1C40F"] },
                { name: "Zen Dynamique", desc: "Bleu ciel", colors: ["#EEF7F9", "#85C1E2", "#5A9FBD", "#F8DC81"] },
                { name: "Lumière & Étoiles ✨", desc: "Ultra lumineux", colors: ["#FFFDF8", "#A8CDB5", "#6BA882", "#F4C430"] },
              ].map((palette) => (
                <div key={palette.name} className="rounded-xl border border-sage-soft bg-white p-3">
                  <p className="mb-1 text-sm font-semibold text-ink">{palette.name}</p>
                  <p className="mb-2 text-xs text-ink-muted">{palette.desc}</p>
                  <div className="flex gap-1.5">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded-md border border-sage-soft"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-ink mt-6">Comment changer de thème</h3>
            <div className="rounded-xl bg-white p-4 border border-sage-soft">
              <ol className="space-y-2 text-sm text-ink-muted">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">1</span>
                  <span>Allez sur la page <strong className="text-ink">Thème & Couleurs</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">2</span>
                  <span>Cliquez sur une des palettes pré-définies → le thème s'applique immédiatement en preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">3</span>
                  <span>Cliquez sur <strong className="text-ink">"Enregistrer le thème"</strong> pour sauvegarder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">4</span>
                  <span>Le site public est mis à jour automatiquement !</span>
                </li>
              </ol>
            </div>

            <div className="rounded-xl bg-sage-light/30 p-4 border border-sage-soft">
              <p className="text-sm text-ink">
                <strong>💡 Astuce :</strong> Dans la section "Personnalisation avancée", vous pouvez modifier chaque couleur individuellement
                pour créer votre propre palette unique !
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "content",
      title: "Contenu du site",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Modifiez tous les textes affichés sur la page d'accueil et les autres pages du site.
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold text-ink">Sections éditables</h3>
            <div className="grid gap-2 text-sm">
              {[
                { name: "Hero (en-tête)", items: ["Surtitre", "Titre en 3 lignes", "Paragraphe", "Texte du badge"] },
                { name: "Bandeau défilant", items: ["Liste de mots-clés (séparés par des virgules)"] },
                { name: "À propos", items: ["Titre", "2 paragraphes", "3 badges", "Citation + auteur"] },
                { name: "Services", items: ["Titre", "Sous-titre"] },
                { name: "Déroulé d'une séance", items: ["Titre", "4 étapes avec durée", "Note de fin"] },
                { name: "Zone d'intervention", items: ["Titre", "Texte", "Liste des communes", "Note"] },
                { name: "Astro-sophrologie", items: ["Titre", "Introduction", "3 points clés", "Note"] },
                { name: "Contact & Footer", items: ["Téléphone", "Email", "Note de contact", "3 lignes de footer"] },
              ].map((section) => (
                <div key={section.name} className="rounded-lg border border-sage-soft bg-white p-3">
                  <p className="font-medium text-ink">{section.name}</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-ink-muted">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-1.5">
                        <span className="text-sage-deep">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-terracotta/10 p-4 border border-terracotta/30 mt-4">
              <p className="text-sm text-ink">
                <strong>⚠️ Important :</strong> Après avoir modifié du contenu, n'oubliez pas de cliquer sur le bouton
                <strong> "Enregistrer tout"</strong> en bas de la page pour sauvegarder vos changements !
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "appointments",
      title: "Rendez-vous & Calendrier",
      icon: CalendarCheck,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Gérez les demandes de rendez-vous et bloquez des périodes d'indisponibilité.
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold text-ink">Page Rendez-vous</h3>
            <p className="text-sm text-ink-muted">
              Vous recevez ici toutes les demandes de réservation effectuées via le site.
            </p>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span><strong className="text-ink">Statut "En attente"</strong> : Nouvelles demandes à traiter</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span><strong className="text-ink">Confirmer</strong> : Accepter la demande (le client reçoit une confirmation)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span><strong className="text-ink">Refuser</strong> : Décliner la demande (avec possibilité d'indiquer pourquoi)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span>Chaque RDV affiche : service, date, heure, nom, téléphone, adresse, message</span>
              </li>
            </ul>

            <h3 className="font-semibold text-ink mt-6">Page Calendrier</h3>
            <p className="text-sm text-ink-muted">
              Bloquez des périodes pour empêcher les réservations (vacances, formations, etc.).
            </p>
            <div className="rounded-xl bg-white p-4 border border-sage-soft">
              <p className="mb-3 text-sm font-medium text-ink">Pour bloquer une période :</p>
              <ol className="space-y-2 text-sm text-ink-muted">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">1</span>
                  <span>Cliquez sur "Nouvelle période bloquée"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">2</span>
                  <span>Choisissez la date de début et de fin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">3</span>
                  <span>Ajoutez un libellé (ex: "Vacances", "Formation")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">4</span>
                  <span>Les créneaux de cette période ne seront plus proposés aux clients</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "clients",
      title: "Clients",
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Consultez la liste de tous vos clients et leur historique de rendez-vous.
          </p>

          <ul className="space-y-2 text-sm text-ink-muted">
            <li className="flex gap-2">
              <span className="text-sage-deep">•</span>
              <span>Chaque client est créé automatiquement lors de sa première réservation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sage-deep">•</span>
              <span>Vous pouvez voir : nom, téléphone, email, adresse, nombre de RDV</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sage-deep">•</span>
              <span>Ajoutez des notes personnelles pour chaque client (visible uniquement par vous)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sage-deep">•</span>
              <span>Utilisez la barre de recherche pour retrouver rapidement un client</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "testimonials",
      title: "Témoignages",
      icon: Quote,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Ajoutez, modifiez ou supprimez les témoignages clients affichés sur la page d'accueil.
          </p>

          <div className="rounded-xl bg-white p-4 border border-sage-soft">
            <p className="mb-3 text-sm font-medium text-ink">Pour ajouter un témoignage :</p>
            <ol className="space-y-2 text-sm text-ink-muted">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">1</span>
                <span>Cliquez sur "Nouveau témoignage"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">2</span>
                <span>Écrivez le témoignage (entre guillemets)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">3</span>
                <span>Indiquez l'auteur (ex: "Marie L.")</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-white">4</span>
                <span>Ajoutez le contexte (ex: "Gestion de l'anxiété · Aspet")</span>
              </li>
            </ol>
          </div>

          <div className="rounded-xl bg-sage-light/30 p-4 border border-sage-soft">
            <p className="text-sm text-ink">
              <strong>💡 Astuce :</strong> Les témoignages authentiques et précis sont plus convaincants.
              N'hésitez pas à demander l'autorisation à vos clients avant de publier leur témoignage.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "faq",
      title: "FAQ (Questions fréquentes)",
      icon: CircleHelp,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Gérez les questions et réponses affichées sur la page d'accueil.
          </p>

          <ul className="space-y-2 text-sm text-ink-muted">
            <li className="flex gap-2">
              <span className="text-sage-deep">•</span>
              <span>Créez autant de questions/réponses que nécessaire</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sage-deep">•</span>
              <span>Les questions les plus importantes en premier (ordre chronologique)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sage-deep">•</span>
              <span>Les réponses peuvent être longues et détaillées</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sage-deep">•</span>
              <span>Modifiez ou supprimez facilement avec les boutons d'action</span>
            </li>
          </ul>

          <div className="rounded-xl bg-sage-light/30 p-4 border border-sage-soft mt-4">
            <p className="text-sm font-medium text-ink mb-2">Questions courantes à inclure :</p>
            <ul className="space-y-1 text-sm text-ink-muted">
              <li>• Remboursement par les mutuelles</li>
              <li>• Matériel nécessaire à domicile</li>
              <li>• Fréquence recommandée des séances</li>
              <li>• Zone de déplacement</li>
              <li>• Durée et tarifs</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "settings",
      title: "Paramètres",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Configurez les paramètres de réservation : jours d'ouverture, horaires et disponibilités.
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold text-ink">Jours d'ouverture</h3>
            <p className="text-sm text-ink-muted">
              Cochez les jours où vous acceptez des rendez-vous. Les jours non cochés seront automatiquement
              bloqués dans le formulaire de réservation.
            </p>

            <h3 className="font-semibold text-ink mt-4">Horaires de consultation</h3>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span><strong className="text-ink">Heure de début</strong> : Premier créneau proposé (ex: 09:00)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span><strong className="text-ink">Heure de fin</strong> : Dernier créneau proposé (ex: 19:00)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage-deep">•</span>
                <span><strong className="text-ink">Intervalle entre les créneaux</strong> : Espacement (ex: 15 min)</span>
              </li>
            </ul>

            <h3 className="font-semibold text-ink mt-4">Limites de réservation</h3>
            <p className="text-sm text-ink-muted">
              <strong className="text-ink">Nombre maximum de RDV par jour</strong> : Limite le nombre de réservations
              quotidiennes pour éviter la surcharge (ex: 5 rendez-vous/jour).
            </p>

            <div className="rounded-xl bg-terracotta/10 p-4 border border-terracotta/30 mt-4">
              <p className="text-sm text-ink">
                <strong>⚠️ Important :</strong> Les modifications s'appliquent immédiatement au formulaire de réservation
                sur le site public. Vérifiez bien vos paramètres avant d'enregistrer !
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-deep to-forest text-white">
          <BookOpen className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink">Guide d'utilisation</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Découvrez toutes les fonctionnalités de votre espace administrateur.
            Cliquez sur chaque section pour voir les détails et instructions.
          </p>
        </div>
      </div>

      {/* Quick tips card */}
      <div className="rounded-2xl border-2 border-etoile/30 bg-gradient-to-br from-etoile/5 to-etoile-soft/10 p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="h-6 w-6 shrink-0 text-etoile" />
          <div>
            <h2 className="mb-2 font-serif text-lg text-ink">Astuces rapides</h2>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li className="flex gap-2">
                <span className="text-etoile">✨</span>
                <span><strong className="text-ink">Glisser-déposer</strong> : Réorganisez vos services en les glissant avec la poignée ⋮⋮</span>
              </li>
              <li className="flex gap-2">
                <span className="text-etoile">✨</span>
                <span><strong className="text-ink">Preview en temps réel</strong> : Les changements de thème s'affichent instantanément</span>
              </li>
              <li className="flex gap-2">
                <span className="text-etoile">✨</span>
                <span><strong className="text-ink">Badge "En attente"</strong> : Le nombre de RDV en attente s'affiche dans la navigation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-etoile">✨</span>
                <span><strong className="text-ink">Aucune limite</strong> : Créez autant de services, témoignages ou FAQ que nécessaire</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Collapsible sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <CollapsibleSection key={section.id} section={section} defaultOpen={index === 0} />
        ))}
      </div>

      {/* Footer help */}
      <div className="rounded-2xl border-2 border-sage-soft bg-sage-light/20 p-6 text-center">
        <p className="text-sm text-ink-muted">
          <strong className="text-ink">Besoin d'aide supplémentaire ?</strong>
          <br />
          Contactez votre développeur Enzo pour toute question technique ou demande de fonctionnalité.
        </p>
      </div>
    </div>
  );
}
