import { getEducation, getRoles } from "@/content/loaders";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ExperienceStage } from "@/components/sections/experience-stage";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { formatRange } from "@/lib/date";

export async function Experience() {
  const [roles, education] = await Promise.all([getRoles(), getEducation()]);

  return (
    <Section id="experience" className="scroll-mt-16 border-t border-edge">
      <Reveal>
        <SectionHeading>Experience</SectionHeading>
      </Reveal>

      <ExperienceStage roles={roles}>
        <ExperienceTimeline roles={roles} />
      </ExperienceStage>

      {education.map((item) => (
        <Reveal
          key={item.id ?? item.institution}
          className="mt-4 flex flex-col gap-x-10 gap-y-1 border-t border-edge pt-8 md:grid md:grid-cols-[10rem_minmax(0,1fr)]"
        >
          <span className="font-mono text-sm text-muted">
            {formatRange(item.start, item.end)}
          </span>
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight">
              {item.degree}
            </h3>
            <p className="mt-1 text-muted">{item.institution}</p>
          </div>
        </Reveal>
      ))}
    </Section>
  );
}
