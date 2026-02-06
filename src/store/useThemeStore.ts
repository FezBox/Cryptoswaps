/**
 * Theme Store
 *
 * Manages theme state (light, dark, system) with localStorage persistence.
 */

import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

// Get system theme preference
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Resolve theme to actual light/dark value
const resolveTheme = (theme: Theme): "light" | "dark" => {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
};

// Apply theme to DOM
const applyTheme = (resolvedTheme: "light" | "dark") => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "system",
  resolvedTheme: "light",

  setTheme: (theme: Theme) => {
    const resolved = resolveTheme(theme);

    set({ theme, resolvedTheme: resolved });

    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }

    // Apply to DOM
    applyTheme(resolved);
  },

  toggleTheme: () => {
    const { resolvedTheme, setTheme } = get();
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  },

  initTheme: () => {
    if (typeof window === "undefined") return;

    // Check localStorage
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const theme = storedTheme || "system";

    // Resolve and apply
    const resolved = resolveTheme(theme);
    set({ theme, resolvedTheme: resolved });
    applyTheme(resolved);

    // Listen to system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentTheme = get().theme;
      if (currentTheme === "system") {
        const newResolved = getSystemTheme();
        set({ resolvedTheme: newResolved });
        applyTheme(newResolved);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
  },
}));
