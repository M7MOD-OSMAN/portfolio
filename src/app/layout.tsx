import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/content";
import { getCurrentRole } from "@/content/loaders";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${profile.name} - ${profile.title}`;

export async function generateMetadata(): Promise<Metadata> {
  // The current employer comes from the CMS, so the description is built here
  // rather than at module scope.
  const currentRole = await getCurrentRole();
  const description = `${profile.title} in ${profile.location} with 5+ years building high-traffic web applications in React, Next.js, and TypeScript${
    currentRole ? `. Currently at ${currentRole.company}` : ""
  }.`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s - ${profile.name}`,
    },
    description,
    applicationName: profile.name,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: profile.name,
      title,
      description,
      url: siteUrl,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
