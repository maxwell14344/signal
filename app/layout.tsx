import type { Metadata } from "next";
import { Inter, Onest } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/jsonld";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NorthStark — Find the Right Customer Support Stack",
    template: "%s — NorthStark",
  },
  description:
    "NorthStark guides you toward the right customer support stack for your business — structured, human-verified reviews of AI chatbots, AI agents, live chat, helpdesk, and CX platforms. Real pricing, real sentiment, honest scorecards.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "NorthStark",
    title: "NorthStark — Find the Right Customer Support Stack",
    description:
      "NorthStark guides you toward the right customer support stack for your business — structured, human-verified reviews of AI chatbots, AI agents, live chat, helpdesk, and CX platforms.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "NorthStark — Find the Right Customer Support Stack",
    description:
      "NorthStark guides you toward the right customer support stack for your business — structured, human-verified reviews of AI customer support tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
