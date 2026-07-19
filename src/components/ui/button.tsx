import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  // Monochrome primary: inverts with the theme. Accent is reserved for
  // links, focus, and highlights (color consistency lock).
  primary:
    "bg-foreground text-background hover:opacity-90 active:translate-y-px",
  secondary:
    "border border-edge-strong text-foreground hover:bg-surface-2 active:translate-y-px",
  ghost: "text-muted hover:text-foreground hover:bg-surface-2",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <a
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}
