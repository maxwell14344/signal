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
}: {
  name: string;
  logo?: string | null;
  website?: string | null;
  size?: number;
}) {
  const src = logo || (website ? faviconUrl(website, size) : null);

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="rounded-lg border border-border object-contain bg-white p-1.5"
        style={{ width: size, height: size }}
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
