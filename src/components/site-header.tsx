"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { profile } from "@/content";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Scroll-spy: watch the sections the nav points at.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          {profile.name}
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden items-center md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition-colors",
                  active === item.href
                    ? "font-medium text-accent-ink"
                    : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <ThemeToggle />

          <button
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="flex size-10 items-center justify-center rounded-full border border-edge text-muted transition-colors hover:border-edge-strong hover:text-foreground md:hidden"
          >
            {open ? (
              <XIcon size={18} weight="bold" />
            ) : (
              <ListIcon size={18} weight="bold" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-edge md:hidden">
          <nav
            aria-label="Primary"
            className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-4"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-(--radius-control) px-3 py-3 text-base transition-colors",
                  active === item.href
                    ? "font-medium text-accent-ink"
                    : "text-muted hover:bg-surface-2 hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
