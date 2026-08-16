import {
  MessageCircle,
  Bot,
  Inbox,
  Ticket,
  MessageSquare,
  BookOpen,
  ShoppingBag,
  Phone,
  Mail,
  BarChart,
  Sparkles,
  Headset,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  "message-circle": MessageCircle,
  bot: Bot,
  inbox: Inbox,
  ticket: Ticket,
  "message-square": MessageSquare,
  "book-open": BookOpen,
  "shopping-bag": ShoppingBag,
  phone: Phone,
  mail: Mail,
  "bar-chart": BarChart,
  sparkles: Sparkles,
  headset: Headset,
};

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string | null;
  className?: string;
}) {
  const Icon = (icon && ICONS[icon]) || Sparkles;
  return <Icon className={className} />;
}
