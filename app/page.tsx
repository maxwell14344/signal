import { Hero } from "@/components/Hero";
import { TrendingStrip } from "@/components/TrendingStrip";
import { CategoryGrid } from "@/components/CategoryGrid";
import { AllToolsGrid } from "@/components/AllToolsGrid";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <TrendingStrip />
      <CategoryGrid />
      <AllToolsGrid />
    </main>
  );
}
