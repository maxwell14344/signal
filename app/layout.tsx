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
    default: "NorthStack — Find the Right Customer Support Stack",
    template: "%s — NorthStack",
  },
  description:
    "NorthStack guides you toward the right customer support stack for your business — structured, human-verified reviews of AI chatbots, AI agents, live chat, helpdesk, and CX platforms. Real pricing, real sentiment, honest scorecards.",
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
