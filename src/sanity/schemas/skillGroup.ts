import { defineField, defineType } from "sanity";

export const skillGroup = defineType({
  name: "skillGroup",
  title: "Skill group",
  type: "document",
  fields: [
    defineField({
      name: "label",
      type: "string",
      description: "Group heading, e.g. 'Core' or 'State & Data'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower sorts first. The first group is emphasised on the site.",
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
    select: { title: "label", items: "items" },
    prepare({ title, items }) {
      return {
        title,
        subtitle: Array.isArray(items) ? items.join(", ") : undefined,
      };
    },
  },
});
