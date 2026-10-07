import { useEffect, useState, type ReactNode } from "react";
import { apiGet } from "@/lib/api";
import { applyTheme } from "@/lib/theme";
import type { ThemeDto } from "@/lib/types";

interface ThemeLoaderProps {
  children: ReactNode;
}

/**
 * ThemeLoader - Loads and applies theme before rendering the app
 */
export function ThemeLoader({ children }: ThemeLoaderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load theme on app startup
    const loadTheme = async () => {
      try {
        const theme = await apiGet<ThemeDto>("/theme");
        if (theme?.colors) {
          applyTheme(theme.colors);
        }
      } catch (error) {
        console.error("Failed to load theme, using default:", error);
        // Continue with default theme from CSS
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, []);

  // Render children immediately (theme applies via CSS variables)
  // The isReady state prevents flash of unstyled content
  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage-soft border-t-sage-deep" />
      </div>
    );
  }

  return <>{children}</>;
}
