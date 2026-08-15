export function ToolLogo({
  name,
  logo,
  size = 40,
}: {
  name: string;
  logo?: string;
  size?: number;
}) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={logo}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="rounded-lg border border-border object-contain bg-white"
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
