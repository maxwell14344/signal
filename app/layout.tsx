import type { Metadata } from "next";
import { Inter, Onest } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Signal — AI Customer Support Tools, Reviewed",
    template: "%s — Signal",
  },
  description:
    "Structured, human-verified reviews of AI customer support tools — chatbots, AI agents, WhatsApp AI, helpdesk automation, and CX platforms. Real pricing, real sentiment, honest scorecards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${onest.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-body">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
