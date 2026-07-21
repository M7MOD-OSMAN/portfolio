import { defineField, defineType } from "sanity";

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "institution",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "degree",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "start",
      type: "string",
      description: "Year and month, e.g. 2014-10",
      validation: (rule) => rule.required().regex(MONTH, { name: "YYYY-MM" }),
    }),
    defineField({
      name: "end",
      type: "string",
      description: "Year and month, e.g. 2019-05",
      validation: (rule) => rule.required().regex(MONTH, { name: "YYYY-MM" }),
    }),
  ],
  preview: {
    select: { title: "degree", subtitle: "institution" },
  },
});
