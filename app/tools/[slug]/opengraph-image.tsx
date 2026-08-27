import { ImageResponse } from "next/og";
import { getToolBySlug } from "@/lib/db/queries";

export const alt = "Tool review";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  const name = tool?.name ?? "Tool review";
  const tagline = tool?.tagline ?? "";
  const rating = tool?.rating != null ? Number(tool.rating).toFixed(1) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#fafaf9",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#d97706", fontWeight: 600 }}>
          <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
            <rect x="8" y="8" width="84" height="84" rx="22" fill="#fafaf9" stroke="#0c0a09" strokeWidth="9" />
            <path d="M30 52 L44 66 L72 34" stroke="#d97706" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          NorthStark Review
        </div>
        <div style={{ marginTop: 36, fontSize: 68, fontWeight: 600, color: "#0c0a09", display: "flex" }}>
          {name}
        </div>
        {tagline && (
          <div style={{ marginTop: 24, fontSize: 30, color: "#44403c", maxWidth: 950, lineHeight: 1.4, display: "flex" }}>
            {tagline}
          </div>
        )}
        {rating && (
          <div style={{ marginTop: 40, fontSize: 26, color: "#78716c", display: "flex" }}>
            Our score: {rating} / 5
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
