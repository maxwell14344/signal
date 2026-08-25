import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ShortlistCompareSection } from "@/components/ShortlistCompareSection";
import { LatestReviewsGrid } from "@/components/LatestReviewsGrid";
import { CTABanner } from "@/components/CTABanner";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <CategoryGrid featured />
      <ShortlistCompareSection />
      <LatestReviewsGrid />
      <CTABanner />
    </main>
  );
}
