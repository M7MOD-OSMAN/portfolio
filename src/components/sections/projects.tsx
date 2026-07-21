import { getProjects } from "@/content/loaders";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ScrubWord } from "@/components/motion/scrub-word";
import { ProjectsGallery } from "./projects-gallery";

export async function Projects() {
  const projects = await getProjects();

  return (
    <Section
      id="projects"
      className="relative isolate scroll-mt-16 border-t border-edge"
    >
      <ScrubWord word="SHIPPED" className="-z-10" />

      <Reveal>
        <SectionHeading>Selected work</SectionHeading>
      </Reveal>

      <Reveal delay={0.05}>
        <ProjectsGallery projects={projects} />
      </Reveal>
    </Section>
  );
}
