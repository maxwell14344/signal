import Image from "next/image";

function faviconUrl(website: string, size: number): string | null {
  try {
    const { hostname } = new URL(website);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${Math.max(size * 2, 64)}`;
  } catch {
    return null;
  }
}

export function ToolLogo({
  name,
  logo,
  website,
  size = 40,
  priority = false,
}: {
  name: string;
  logo?: string | null;
  website?: string | null;
  size?: number;
  priority?: boolean;
}) {
  const src = logo || (website ? faviconUrl(website, size) : null);

  if (src) {
    const className = "rounded-lg border border-border object-contain bg-white p-1.5";
    const style = { width: size, height: size };

    // Admin-provided logo URLs can point to any arbitrary domain, which
    // next/image can't optimize without a matching remote pattern — fall
    // back to a plain img tag for those. Favicon URLs are always our own
    // Google favicon proxy, so those get full next/image optimization.
    if (logo) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={`${name} logo`} width={size} height={size} className={className} style={style} loading={priority ? "eager" : "lazy"} />;
    }

    return (
      <Image
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={className}
        style={style}
      />
    );
  }

  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-lg border border-border bg-surface-2 font-semibold text-accent"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      {initial}
    </div>
  );
}
