import Image from "next/image";
import { profile } from "@/content";
import { getCurrentRole } from "@/content/loaders";
import { ButtonLink } from "@/components/ui/button";
import { Rise } from "@/components/ui/rise";

export async function Hero() {
  const currentRole = await getCurrentRole();

  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pt-14 pb-24 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:px-10 md:pt-20 md:pb-32">
      <div className="flex max-w-2xl flex-col gap-6">
        <Rise>
          <p className="font-mono text-sm text-muted">
            {profile.title}
            {currentRole ? ` at ${currentRole.company}` : null}
          </p>
        </Rise>
        <Rise delay={0.08}>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl md:leading-[1.02]">
            {profile.name}
          </h1>
        </Rise>
        <Rise delay={0.16}>
          <p className="max-w-[55ch] text-lg leading-relaxed text-muted">
            5+ years building high-traffic web apps with React, Next.js, and
            TypeScript. Leading architecture, design systems, and performance.
          </p>
        </Rise>
        <Rise delay={0.24}>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="#contact">Get in touch</ButtonLink>
            <ButtonLink href="#projects" variant="secondary">
              View projects
            </ButtonLink>
          </div>
        </Rise>
      </div>

      <Rise delay={0.2} className="justify-self-center md:justify-self-end">
        <div className="relative w-56 md:w-80">
          <div
            aria-hidden
            className="absolute -inset-3 -z-10 -rotate-3 rounded-(--radius-surface) bg-accent-soft"
          />
          <div className="relative aspect-4/5 overflow-hidden rounded-(--radius-surface) border border-edge bg-surface-2">
            <Image
              src={profile.portraitSrc}
              alt={`Portrait of ${profile.name}`}
              fill
              priority
              sizes="(min-width: 768px) 20rem, 14rem"
              className="object-cover object-top"
            />
          </div>
        </div>
      </Rise>
    </section>
  );
}
