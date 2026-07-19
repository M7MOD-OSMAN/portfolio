"use client";

import { useActionState } from "react";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { profile } from "@/content";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

const initialState: ContactState = { status: "idle" };

const fieldClasses =
  "w-full rounded-(--radius-control) border bg-surface px-3.5 py-2.5 text-sm transition-colors placeholder:text-muted/60";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-accent-ink">
      {message}
    </p>
  );
}

export function Contact() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  return (
    <Section id="contact" className="scroll-mt-16 border-t border-edge">
      <Reveal className="flex max-w-2xl flex-col gap-4">
        <SectionHeading>Get in touch</SectionHeading>
        <p className="leading-relaxed text-muted">
          Open to senior frontend roles and interesting product work. Send a
          message and I will reply by email.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mt-10 max-w-2xl">
        {state.status === "success" ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-(--radius-surface) border border-edge bg-surface p-6"
          >
            <CheckCircleIcon
              size={22}
              weight="fill"
              className="mt-0.5 shrink-0 text-accent"
            />
            <div>
              <p className="font-medium">Message sent</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Thanks for reaching out. I will get back to you by email as soon
                as I can.
              </p>
            </div>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(state.errors?.name)}
                  aria-describedby={
                    state.errors?.name ? "name-error" : undefined
                  }
                  className={cn(
                    fieldClasses,
                    state.errors?.name ? "border-accent" : "border-edge",
                  )}
                />
                <FieldError id="name-error" message={state.errors?.name} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(state.errors?.email)}
                  aria-describedby={
                    state.errors?.email ? "email-error" : undefined
                  }
                  className={cn(
                    fieldClasses,
                    state.errors?.email ? "border-accent" : "border-edge",
                  )}
                />
                <FieldError id="email-error" message={state.errors?.email} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                aria-invalid={Boolean(state.errors?.message)}
                aria-describedby={
                  state.errors?.message ? "message-error" : undefined
                }
                className={cn(
                  fieldClasses,
                  "resize-y",
                  state.errors?.message ? "border-accent" : "border-edge",
                )}
              />
              <FieldError id="message-error" message={state.errors?.message} />
            </div>

            {/* Honeypot: moved off-screen rather than hidden, so bots still fill it. */}
            <div className="absolute left-[-9999px]" aria-hidden>
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" disabled={pending}>
                {pending ? "Sending" : "Send message"}
              </Button>
              <p aria-live="polite" className="text-sm text-accent-ink">
                {state.status === "error" && state.message ? state.message : ""}
              </p>
            </div>
          </form>
        )}
      </Reveal>

      <Reveal
        delay={0.12}
        className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-edge pt-8 text-sm"
      >
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
        >
          <EnvelopeSimpleIcon size={16} weight="bold" />
          {profile.email}
        </a>
        {profile.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted transition-colors hover:text-foreground"
          >
            {social.label}
            <ArrowUpRightIcon size={13} weight="bold" />
          </a>
        ))}
      </Reveal>
    </Section>
  );
}
