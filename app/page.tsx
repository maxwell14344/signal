import { Hero } from "@/components/Hero";
import { TrendingStrip } from "@/components/TrendingStrip";
import { CategoryGrid } from "@/components/CategoryGrid";
import { JointPagesSection } from "@/components/JointPagesSection";
import { LatestReviewsGrid } from "@/components/LatestReviewsGrid";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <TrendingStrip />
      <CategoryGrid featured />
      <JointPagesSection />
      <LatestReviewsGrid />
    </main>
  );
}
