"use server";

import { getSiteSettings } from "@/lib/db/queries";

export async function submitContactAction(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in your name, email, and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const settings = await getSiteSettings();
  const to = settings.contactEmail;

  if (!to) {
    console.error("Contact form: no contactEmail configured in site settings.");
    return { error: "This form isn't accepting messages right now. Please try again later." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set.");
    return { error: "This form isn't accepting messages right now. Please try again later." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NorthStark Contact Form <onboarding@resend.dev>",
        to,
        reply_to: email,
        subject: `New contact form message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend send failed:", res.status, body);
      return { error: "Something went wrong sending your message. Please try again." };
    }
  } catch (err) {
    console.error("Resend send failed:", err);
    return { error: "Something went wrong sending your message. Please try again." };
  }

  return { success: true };
}
