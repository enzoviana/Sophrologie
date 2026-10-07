import { type ReactNode } from "react";
import { useTheme } from "@/lib/useTheme";

interface ThemeLoaderProps {
  children: ReactNode;
}

/**
 * ThemeLoader - Loads and applies theme before rendering the app
 * Uses React Query cache so theme updates from admin are reflected immediately
 */
export function ThemeLoader({ children }: ThemeLoaderProps) {
  const { isLoading } = useTheme();

  // Show loader while theme is loading
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage-soft border-t-sage-deep" />
      </div>
    );
  }

  // Theme is loaded and applied via useTheme hook
  return <>{children}</>;
}
