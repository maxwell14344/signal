import { ImageResponse } from "next/og";
import { getComparisonBySlug } from "@/lib/db/queries";

export const alt = "Tool comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ comparisonSlug: string }> }) {
  const { comparisonSlug } = await params;
  const comparison = await getComparisonBySlug(comparisonSlug);
  const nameA = comparison?.toolA?.name ?? "Tool A";
  const nameB = comparison?.toolB?.name ?? "Tool B";

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
          NorthStark Comparison
        </div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontSize: 60, fontWeight: 600, color: "#0c0a09", display: "flex" }}>{nameA}</div>
          <div style={{ fontSize: 36, color: "#78716c", display: "flex" }}>vs</div>
          <div style={{ fontSize: 60, fontWeight: 600, color: "#0c0a09", display: "flex" }}>{nameB}</div>
        </div>
        <div style={{ marginTop: 36, fontSize: 28, color: "#44403c", display: "flex" }}>
          Which one should you choose? An in-depth comparison.
        </div>
      </div>
    ),
    { ...size }
  );
}
