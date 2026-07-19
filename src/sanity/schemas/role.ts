import { defineField, defineType } from "sanity";

/** ISO year-month, e.g. "2025-10" — what `formatRange` in src/lib/date.ts expects. */
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export const role = defineType({
  name: "role",
  title: "Role",
  type: "document",
  fields: [
    defineField({
      name: "company",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Job title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "start",
      type: "string",
      description: "Year and month, e.g. 2025-10",
      validation: (rule) =>
        rule.required().regex(MONTH, { name: "YYYY-MM" }),
    }),
    defineField({
      name: "end",
      type: "string",
      description: "Year and month, e.g. 2025-11. Leave empty if this is your current role.",
      validation: (rule) => rule.regex(MONTH, { name: "YYYY-MM" }),
    }),
    defineField({
      name: "sideEngagement",
      title: "Concurrent engagement",
      type: "boolean",
      description:
        "A side or contract role running alongside a primary role. Shown as 'Concurrent engagement'.",
      initialValue: false,
    }),
    defineField({
      name: "highlights",
      type: "array",
      of: [{ type: "text" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "tech",
      title: "Tech",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  orderings: [
    {
      name: "startDesc",
      title: "Newest first",
      by: [{ field: "start", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", company: "company", start: "start", end: "end" },
    prepare({ title, company, start, end }) {
      return {
        title: `${title} · ${company}`,
        subtitle: `${start} – ${end ?? "present"}`,
      };
    },
  },
});
