export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="22"
        fill="var(--background)"
        stroke="var(--foreground)"
        strokeWidth="9"
      />
      <path
        d="M30 52 L44 66 L72 34"
        stroke="var(--accent)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
