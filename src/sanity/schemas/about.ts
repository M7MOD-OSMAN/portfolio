import { defineField, defineType } from "sanity";

/**
 * Singleton. There is only ever one About document; the query takes the first
 * one it finds, and the Studio's structure should surface it as a single item
 * rather than a creatable list.
 */
export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "One entry per paragraph.",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "backgroundWord",
      title: "Background word",
      type: "string",
      description:
        "Scrubbed across the section background as the reader scrolls. One word, no spaces. Keep it short: anything past about twelve characters stops fitting on narrow screens.",
      validation: (rule) =>
        rule
          .required()
          .max(14)
          .custom((value) =>
            value && /\s/.test(value) ? "Must be a single word." : true,
          ),
      initialValue: "ARCHITECTURE",
    }),
  ],
  preview: {
    select: { body: "body", word: "backgroundWord" },
    prepare({ body, word }) {
      return {
        title: "About",
        subtitle: Array.isArray(body) ? body[0] : word,
      };
    },
  },
});
