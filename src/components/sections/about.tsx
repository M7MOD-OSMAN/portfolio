import { getAbout } from "@/content/loaders";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ScrubWord } from "@/components/motion/scrub-word";
import { SignalGrid } from "@/components/sections/signal-grid";

export async function About() {
  const about = await getAbout();

  return (
    <Section id="about" className="relative isolate scroll-mt-16 border-t border-edge">
      <ScrubWord word={about.backgroundWord} className="-z-10" />

      <Reveal>
        <SectionHeading>About</SectionHeading>
      </Reveal>

      <div className="mt-12 flex flex-col gap-5">
        {about.body.map((paragraph, index) => (
          <Reveal key={paragraph} delay={index * 0.06}>
            <p className="max-w-[65ch] leading-relaxed text-muted">
              {paragraph}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <SignalGrid />
      </Reveal>
    </Section>
  );
}
