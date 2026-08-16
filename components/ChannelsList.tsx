import {
  MessageCircle,
  Mail,
  Phone,
  MessageSquare,
  Camera,
  Send,
  Smartphone,
  Globe,
} from "lucide-react";

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Web Chat": MessageCircle,
  Email: Mail,
  Phone: Phone,
  Voice: Phone,
  WhatsApp: MessageSquare,
  "Instagram DM": Camera,
  "Facebook Messenger": Send,
  SMS: Smartphone,
};

export function ChannelsList({ channels }: { channels: string[] }) {
  if (!channels || channels.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg">Channels</h2>
      <div className="flex flex-wrap gap-2">
        {channels.map((channel) => {
          const Icon = CHANNEL_ICONS[channel] ?? Globe;
          return (
            <span
              key={channel}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-body"
            >
              <Icon className="h-3.5 w-3.5 text-muted" />
              {channel}
            </span>
          );
        })}
      </div>
    </div>
  );
}
