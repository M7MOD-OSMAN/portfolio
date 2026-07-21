import { NextStudioLayout } from "next-sanity/studio";

/**
 * The Studio manages its own full-viewport layout, so it opts out of the site
 * chrome applied in `app/(site)/layout.tsx`.
 */
export default function StudioRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NextStudioLayout>{children}</NextStudioLayout>;
}
