"use server";

import { Resend } from "resend";
import { z } from "zod";
import { profile } from "@/content";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a sentence.")
    .max(4000, "Message is too long."),
  // Honeypot: real users never see or fill this.
  company: z.string().max(0).optional(),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "company") {
        // Honeypot tripped: accept silently so bots learn nothing.
        return { status: "success" };
      }
      if (field === "name" || field === "email" || field === "message") {
        errors[field] ??= issue.message;
      }
    }
    return { status: "error", errors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; contact form cannot send.");
    return {
      status: "error",
      message: "Email is not configured right now. Please use the links below.",
    };
  }

  const { name, email, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [profile.email],
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\nFrom: ${name} <${email}>`,
    });

    if (error) {
      console.error("Resend rejected the message:", error);
      return {
        status: "error",
        message: "Could not send the message. Please try again or email me directly.",
      };
    }

    return { status: "success" };
  } catch (error) {
    console.error("Contact form failed:", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again or email me directly.",
    };
  }
}
