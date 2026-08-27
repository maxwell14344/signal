import { ImageResponse } from "next/og";

export const alt = "NorthStark — Find the Right Customer Support Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#fafaf9",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 100 100" fill="none">
            <rect x="8" y="8" width="84" height="84" rx="22" fill="#fafaf9" stroke="#0c0a09" strokeWidth="9" />
            <path d="M30 52 L44 66 L72 34" stroke="#d97706" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 600, color: "#0c0a09" }}>NorthStark</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 34, color: "#44403c", maxWidth: 900, lineHeight: 1.4, display: "flex" }}>
          Find the right customer support stack for your business
        </div>
        <div style={{ marginTop: 32, fontSize: 22, color: "#78716c", display: "flex" }}>
          Structured reviews · Real pricing · Honest scorecards
        </div>
      </div>
    ),
    { ...size }
  );
}
