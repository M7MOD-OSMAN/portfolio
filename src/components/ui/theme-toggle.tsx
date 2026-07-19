"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

/**
 * Hydration-safe without a mounted check: markup is identical on server and
 * client (both icons rendered), and the .dark class on <html> decides which
 * icon is visible via CSS.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex size-10 items-center justify-center rounded-full border border-edge text-muted transition-colors hover:border-edge-strong hover:text-foreground"
    >
      <SunIcon size={18} weight="bold" className="hidden dark:block" />
      <MoonIcon size={18} weight="bold" className="dark:hidden" />
    </button>
  );
}
