import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "@/lib/useTheme";
import { THEME_PRESETS, getPresetById } from "@/lib/theme";
import type { ThemeColors } from "@/lib/types";

interface ColorInputProps {
  label: string;
  colorKey: keyof ThemeColors;
  value: string;
  onChange: (key: keyof ThemeColors, value: string) => void;
}

function ColorInput({ label, colorKey, value, onChange }: ColorInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(colorKey, e.target.value)}
          className="h-10 w-16 cursor-pointer rounded-lg border-2 border-sage-soft"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(colorKey, e.target.value.toUpperCase())}
          placeholder="#000000"
          maxLength={7}
          className="flex-1 rounded-lg border border-sage-soft px-3 py-2 text-sm font-mono uppercase focus:border-sage-deep focus:outline-none"
        />
      </div>
    </div>
  );
}

interface PresetCardProps {
  preset: typeof THEME_PRESETS[0];
  isSelected: boolean;
  onSelect: () => void;
}

function PresetCard({ preset, isSelected, onSelect }: PresetCardProps) {
  const mainColors = [
    preset.colors["sage-deep"],
    preset.colors["forest"],
    preset.colors["terracotta"],
    preset.colors["etoile"],
    preset.colors["cream"],
  ];

  return (
    <button
      onClick={onSelect}
      className={`group relative rounded-2xl border-2 p-5 text-left transition-all ${
        isSelected
          ? "border-sage-deep bg-sage-light/30 shadow-lg"
          : "border-sage-soft bg-white hover:border-sage hover:shadow-md"
      }`}
    >
      {isSelected && (
        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-sage-deep text-white">
          <Check className="h-4 w-4" />
        </div>
      )}
      <h3 className="mb-1 text-lg font-semibold text-ink">{preset.name}</h3>
      <p className="mb-4 text-sm text-ink-muted">{preset.description}</p>
      <div className="flex gap-2">
        {mainColors.map((color, idx) => (
          <div
            key={idx}
            className="h-8 w-8 rounded-lg border border-sage-soft shadow-sm"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </button>
  );
}

function ThemePreview({ colors }: { colors: ThemeColors }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-sage-soft bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-ink">Aperçu</h3>
      <div className="space-y-3">
        {/* Header preview */}
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: colors["cream"] }}
        >
          <div
            className="mb-2 h-2 w-24 rounded"
            style={{ backgroundColor: colors["sage-deep"] }}
          />
          <div
            className="h-2 w-16 rounded"
            style={{ backgroundColor: colors["ink-muted"] }}
          />
        </div>
        {/* Button preview */}
        <div className="flex gap-2">
          <div
            className="rounded-lg px-4 py-2 text-xs font-medium text-white"
            style={{ backgroundColor: colors["terracotta"] }}
          >
            Bouton principal
          </div>
          <div
            className="rounded-lg px-4 py-2 text-xs font-medium"
            style={{
              backgroundColor: colors["sage-light"],
              color: colors["forest"],
            }}
          >
            Bouton secondaire
          </div>
        </div>
        {/* Card preview */}
        <div
          className="rounded-lg border p-3"
          style={{ borderColor: colors["sage-soft"] }}
        >
          <div
            className="mb-2 h-2 w-20 rounded"
            style={{ backgroundColor: colors["ink"] }}
          />
          <div
            className="h-2 w-full rounded"
            style={{ backgroundColor: colors["sand"] }}
          />
        </div>
      </div>
    </div>
  );
}

const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  "sage-light": "Sage clair",
  "sage-soft": "Sage doux",
  "sage": "Sage",
  "sage-deep": "Sage profond",
  "forest": "Forêt",
  "cream": "Crème",
  "sand": "Sable",
  "terracotta": "Terracotta",
  "terracotta-hover": "Terracotta hover",
  "etoile": "Étoile",
  "etoile-soft": "Étoile doux",
  "ink": "Encre",
  "ink-muted": "Encre atténué",
};

export default function ThemePage() {
  const { theme, saveTheme, isSaving } = useTheme();
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [customColors, setCustomColors] = useState<ThemeColors | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize from loaded theme
  useEffect(() => {
    if (theme) {
      setSelectedPresetId(theme.palette_name);
      setCustomColors(theme.colors);
    }
  }, [theme]);

  const handlePresetSelect = (presetId: string) => {
    const preset = getPresetById(presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setCustomColors(preset.colors);
      setHasChanges(true);
    }
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    if (!customColors) return;

    // Validate hex format
    if (!/^#[0-9A-Fa-f]{0,6}$/.test(value)) return;

    setCustomColors({
      ...customColors,
      [key]: value,
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!customColors) return;

    saveTheme({
      palette_name: selectedPresetId,
      colors: customColors,
    });
    setHasChanges(false);
  };

  if (!customColors) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage-soft border-t-sage-deep" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Palette className="h-6 w-6 text-sage-deep" />
          <h1 className="text-3xl font-bold text-ink">Thème & Couleurs</h1>
        </div>
        <p className="text-ink-muted">
          Choisissez une palette pré-définie ou personnalisez couleur par couleur
        </p>
      </div>

      {/* Preset Selection */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-ink">
          Palettes pré-définies
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {THEME_PRESETS.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={selectedPresetId === preset.id}
              onSelect={() => handlePresetSelect(preset.id)}
            />
          ))}
        </div>
      </section>

      {/* Custom Colors */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-ink">
          Personnalisation avancée
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border-2 border-sage-soft bg-white p-6">
            <h3 className="mb-4 font-semibold text-ink">Couleurs principales</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {(Object.keys(COLOR_LABELS) as Array<keyof ThemeColors>).map((key) => (
                <ColorInput
                  key={key}
                  label={COLOR_LABELS[key]}
                  colorKey={key}
                  value={customColors[key]}
                  onChange={handleColorChange}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <ThemePreview colors={customColors} />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end gap-3 border-t border-sage-soft pt-6">
        {hasChanges && (
          <span className="flex items-center text-sm text-ink-muted">
            Modifications non enregistrées
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="rounded-xl bg-terracotta px-6 py-3 font-medium text-white transition-colors hover:bg-terracotta-hover disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer le thème"}
        </button>
      </div>
    </div>
  );
}
