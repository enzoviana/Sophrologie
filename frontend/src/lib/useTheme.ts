import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut } from "./api";
import { applyTheme } from "./theme";
import type { ThemeDto, ThemeColors } from "./types";

/**
 * Hook to manage theme loading and saving
 */
export function useTheme() {
  const queryClient = useQueryClient();

  // Load theme from API
  const {
    data: theme,
    isLoading,
    error,
  } = useQuery<ThemeDto>({
    queryKey: ["site-theme"],
    queryFn: () => apiGet<ThemeDto>("/theme"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Apply theme when it loads or changes
  useEffect(() => {
    if (theme?.colors) {
      applyTheme(theme.colors);
    }
  }, [theme]);

  // Save theme mutation
  const saveMutation = useMutation<
    ThemeDto,
    Error,
    { palette_name: string; colors: ThemeColors }
  >({
    mutationFn: async (newTheme: { palette_name: string; colors: ThemeColors }) => {
      // Convert kebab-case to snake_case for API
      const colorsSnakeCase = Object.entries(newTheme.colors).reduce(
        (acc, [key, value]) => {
          acc[key.replace(/-/g, "_")] = value;
          return acc;
        },
        {} as Record<string, string>
      );

      return apiPut<ThemeDto>("/theme", {
        palette_name: newTheme.palette_name,
        colors: colorsSnakeCase,
      });
    },
    onSuccess: (data) => {
      console.log("Theme mutation success, received data:", data);
      // Update cache
      queryClient.setQueryData(["site-theme"], data);
      // Apply theme immediately
      if (data?.colors) {
        console.log("Applying theme from mutation success");
        applyTheme(data.colors);
      } else {
        console.warn("No colors in response data:", data);
      }
    },
    onError: (error) => {
      console.error("Theme mutation error:", error);
    },
  });

  return {
    theme,
    isLoading,
    error,
    saveTheme: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
  };
}
