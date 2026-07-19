import { cn } from "@/lib/cn";

/**
 * Section shell: owns vertical rhythm and horizontal containment so
 * individual sections never invent their own spacing.
 */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-24 md:py-32", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">{children}</div>
    </section>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-3xl font-bold tracking-tight md:text-4xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}
