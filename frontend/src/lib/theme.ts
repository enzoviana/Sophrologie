import type { ThemeColors, ThemePreset } from "./types";

/**
 * CSS Variable mapping - maps theme color keys to the CSS variable names
 * We modify the -value variables which are then referenced by all other variables
 */
export const CSS_VARIABLE_MAP: Record<keyof ThemeColors, string> = {
  "sage-light": "--sage-light-value",
  "sage-soft": "--sage-soft-value",
  "sage": "--sage-value",
  "sage-deep": "--sage-deep-value",
  "forest": "--forest-value",
  "cream": "--cream-value",
  "sand": "--sand-value",
  "terracotta": "--terracotta-value",
  "terracotta-hover": "--terracotta-hover-value",
  "etoile": "--etoile-value",
  "etoile-soft": "--etoile-soft-value",
  "ink": "--ink-value",
  "ink-muted": "--ink-muted-value",
};

/**
 * Pre-defined theme palettes
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "sage_forest",
    name: "Sauge & Forêt",
    description: "Palette actuelle - Douceur végétale et sérénité",
    colors: {
      "sage-light": "#E9EFE7",
      "sage-soft": "#C7D8C6",
      "sage": "#8FA98F",
      "sage-deep": "#4E6B50",
      "forest": "#243E2B",
      "cream": "#FAF7F2",
      "sand": "#F0EAE1",
      "terracotta": "#2B618F",
      "terracotta-hover": "#1B415C",
      "etoile": "#E6B432",
      "etoile-soft": "#F5D67E",
      "ink": "#1E2922",
      "ink-muted": "#526557",
    },
  },
  {
    id: "mediterranee",
    name: "Méditerranée",
    description: "Bleu océan et jaune soleil",
    colors: {
      "sage-light": "#E8F4F8",
      "sage-soft": "#B8D8E5",
      "sage": "#6BA8C4",
      "sage-deep": "#2E7D96",
      "forest": "#1A4A5C",
      "cream": "#FFF8EF",
      "sand": "#F5E8D8",
      "terracotta": "#E89F3C",
      "terracotta-hover": "#C77D1F",
      "etoile": "#F4C542",
      "etoile-soft": "#F8DD8F",
      "ink": "#1C2E35",
      "ink-muted": "#527580",
    },
  },
  {
    id: "vitamine",
    name: "Fraîcheur Vitaminée",
    description: "Turquoise vif et jaune éclatant",
    colors: {
      "sage-light": "#E8F8F5",
      "sage-soft": "#A7E6D7",
      "sage": "#52C9B3",
      "sage-deep": "#1ABC9C",
      "forest": "#117A65",
      "cream": "#FFFBF0",
      "sand": "#FFF3D6",
      "terracotta": "#F1C40F",
      "terracotta-hover": "#C29D0B",
      "etoile": "#F39C12",
      "etoile-soft": "#F8C471",
      "ink": "#1E2C24",
      "ink-muted": "#52796F",
    },
  },
  {
    id: "zen",
    name: "Zen Dynamique",
    description: "Bleu ciel et vert prairie",
    colors: {
      "sage-light": "#EEF7F9",
      "sage-soft": "#C6E7ED",
      "sage": "#85C1E2",
      "sage-deep": "#5A9FBD",
      "forest": "#2A5F75",
      "cream": "#F9F9F5",
      "sand": "#F0EDE3",
      "terracotta": "#7FB69E",
      "terracotta-hover": "#5E9178",
      "etoile": "#F8DC81",
      "etoile-soft": "#FBE9B0",
      "ink": "#1F2922",
      "ink-muted": "#556B61",
    },
  },
  {
    id: "lumiere_etoiles",
    name: "Lumière & Étoiles",
    description: "Palette lumineuse avec étoiles dorées éclatantes",
    colors: {
      "sage-light": "#F5FAF7",
      "sage-soft": "#E0F0E5",
      "sage": "#A8CDB5",
      "sage-deep": "#6BA882",
      "forest": "#3A6B4F",
      "cream": "#FFFDF8",
      "sand": "#FFF8ED",
      "terracotta": "#E8A05D",
      "terracotta-hover": "#D98845",
      "etoile": "#F4C430",
      "etoile-soft": "#FFE380",
      "ink": "#2C3E35",
      "ink-muted": "#6B8073",
    },
  },
];

/**
 * Apply theme colors to CSS variables
 * Only modifies the -value variables; all other variables reference these automatically
 */
export function applyTheme(colors: ThemeColors): void {
  console.log("🎨 Applying theme colors to entire site:", colors);

  // Apply base color values
  // All other variables (--color-*, --primary, --secondary, etc.) reference these automatically
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = CSS_VARIABLE_MAP[key as keyof ThemeColors];
    if (cssVar) {
      document.documentElement.style.setProperty(cssVar, value);
      console.log(`  ✓ ${cssVar} = ${value}`);
    }
  });

  console.log("✅ Theme applied successfully!");
}

/**
 * Validate theme colors (all must be valid hex)
 */
export function validateThemeColors(colors: Partial<ThemeColors>): boolean {
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  return Object.values(colors).every((color) => hexPattern.test(color));
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((preset) => preset.id === id);
}
