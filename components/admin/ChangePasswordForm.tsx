"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/actions/auth";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, undefined);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <label htmlFor="current" className="mb-1.5 block text-sm text-muted">Current password</label>
        <input
          id="current"
          name="current"
          type="password"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="next" className="mb-1.5 block text-sm text-muted">New password</label>
        <input
          id="next"
          name="next"
          type="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm text-muted">Confirm new password</label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-negative">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-positive">
          Password changed. For full security, also rotate AUTH_SECRET in
          Vercel&apos;s dashboard to invalidate any other active sessions.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
