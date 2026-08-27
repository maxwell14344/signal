import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with NorthStark — questions, corrections, or a tool you think we should review.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="eyebrow text-accent">Get in touch</p>
        <h1 className="mt-2 text-3xl tracking-tight">Contact us</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-body">
          Spotted an error, have a tool we should review, or just want to say
          hi? Send a message below and we&apos;ll get back to you.
        </p>

        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
