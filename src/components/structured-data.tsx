import { profile } from "@/content";
import {
  getCurrentRole,
  getEducation,
  getSkillGroups,
} from "@/content/loaders";
import { siteUrl } from "@/lib/site";

/**
 * Person schema so search engines and AI summarisers can resolve who this
 * site is about. Every value is derived from the same content layer the page
 * renders from, so the markup cannot drift from what visitors see.
 */
export async function StructuredData() {
  const [currentRole, education, skillGroups] = await Promise.all([
    getCurrentRole(),
    getEducation(),
    getSkillGroups(),
  ]);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    image: `${siteUrl}${profile.portraitSrc}`,
    jobTitle: profile.title,
    description: profile.summary,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mansoura",
      addressCountry: "EG",
    },
    sameAs: profile.socials.map((social) => social.href),
    knowsLanguage: profile.languages.map((language) => language.name),
    knowsAbout: skillGroups.flatMap((group) => group.items),
    ...(currentRole && {
      worksFor: {
        "@type": "Organization",
        name: currentRole.company,
      },
    }),
    alumniOf: education.map((item) => ({
      "@type": "CollegeOrUniversity",
      name: item.institution,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Values come from the content layer, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
