import { education, profile, roles, skillGroups } from "@/content";
import { siteUrl } from "@/lib/site";

/**
 * Person schema so search engines and AI summarisers can resolve who this
 * site is about. Every value is derived from the typed content layer, so the
 * markup cannot drift from what the page displays.
 */
export function StructuredData() {
  const currentRole = roles.find((role) => role.end === null);

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
      // Values come from local content, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
