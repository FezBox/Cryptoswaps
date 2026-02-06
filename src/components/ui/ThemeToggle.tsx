"use client";

/**
 * ThemeToggle Component
 *
 * Toggle button for switching between light and dark themes.
 */

import { useThemeStore } from "@/store/useThemeStore";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-lg bg-white dark:bg-zinc-800
                 border border-primary-100 dark:border-zinc-700
                 hover:bg-primary-50 dark:hover:bg-zinc-700
                 transition-colors flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === "light" ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <Sun className="w-5 h-5 text-primary-600" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <Moon className="w-5 h-5 text-accent-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
