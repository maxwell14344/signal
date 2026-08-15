import { Code2, Clapperboard, PenLine, Image as ImageIcon, Sparkles } from "lucide-react";
import type { LucideProps } from "lucide-react";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  code: Code2,
  video: Clapperboard,
  pen: PenLine,
  image: ImageIcon,
};

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = ICONS[icon] ?? Sparkles;
  return <Icon className={className} />;
}
