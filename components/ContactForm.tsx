"use client";

import { useActionState } from "react";
import { submitContactAction } from "@/lib/actions/contact";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, undefined);

  if (state?.success) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 card-shadow">
        <p className="text-sm text-foreground">
          Thanks — your message has been sent. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-negative">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
