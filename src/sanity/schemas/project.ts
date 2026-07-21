import { defineField, defineType } from "sanity";

/** Matches the `Project` shape in `src/content/types.ts`. */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Live URL",
      type: "url",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      description: "What the project is and what you built or led.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      description:
        "Short domain label shown on the card, e.g. 'E-commerce' or 'Client portal'.",
    }),
    defineField({
      name: "highlights",
      type: "array",
      of: [{ type: "text" }],
      description:
        "Only rendered for the lead (first featured) project on the site.",
    }),
    defineField({
      name: "tech",
      title: "Tech",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "featured",
      type: "boolean",
      description:
        "Featured projects get case-study treatment; the rest appear under 'Also shipped'.",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Screenshot",
      type: "image",
      options: { hotspot: true },
      description:
        "Without an image the card falls back to a two-letter monogram.",
    }),
    defineField({
      name: "order",
      type: "number",
      description:
        "Lower sorts first. The first featured project becomes the large lead card.",
      validation: (rule) => rule.required().integer(),
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      name: "orderAsc",
      title: "Display order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", featured: "featured", media: "image" },
    prepare({ title, featured, media }) {
      return {
        title,
        subtitle: featured ? "Featured" : "Also shipped",
        media,
      };
    },
  },
});
