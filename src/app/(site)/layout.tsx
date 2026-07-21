import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "@/components/structured-data";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

/**
 * Chrome for the public site. Lives in a route group so `/studio` can render
 * without the theme provider, skip link, JSON-LD or smooth scrolling.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <ThemeProvider>{children}</ThemeProvider>
      <StructuredData />
    </>
  );
}
