import { cn } from "@/lib/cn";

/**
 * CSS-only entrance animation for above-the-fold content.
 *
 * Unlike <Reveal>, this renders as a Server Component and needs no hydration,
 * so the browser can paint immediately. Use it above the fold; use <Reveal>
 * for anything that should animate on scroll.
 */
export function Rise({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("animate-rise", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
