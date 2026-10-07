import { createContext, useContext, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Eye, LayoutDashboard, Pencil } from "lucide-react";
import { useAuth } from "./auth";

const EditModeContext = createContext<{ enabled: boolean; toggle: () => void }>({
  enabled: false,
  toggle: () => {},
});

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  return (
    <EditModeContext.Provider value={{ enabled, toggle: () => setEnabled((e) => !e) }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditToolbar() {
  const { user } = useAuth();
  const { enabled, toggle } = useEditMode();
  if (!user) return null;
  return (
    <div
      data-testid="edit-toolbar"
      className="fixed bottom-5 left-1/2 z-[70] flex max-w-[94vw] -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-white/95 py-2 pl-2 pr-3 shadow-2xl shadow-forest/20 backdrop-blur-xl"
    >
      <button
        data-testid="edit-mode-toggle"
        onClick={toggle}
        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
          enabled ? "bg-etoile text-ink" : "bg-forest text-cream hover:bg-sage-deep"
        }`}
      >
        {enabled ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        {enabled ? "Quitter l'édition" : "Modifier le site"}
      </button>
      {enabled && (
        <span className="hidden text-xs text-ink-muted md:block">
          Cliquez sur un texte ou une image pour le modifier · glissez les sections pour les réordonner
        </span>
      )}
      <Link
        to="/admin"
        data-testid="edit-toolbar-admin-link"
        className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2.5 text-xs font-medium text-ink-muted transition-colors hover:border-sage-deep hover:text-forest"
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        Admin
      </Link>
    </div>
  );
}
