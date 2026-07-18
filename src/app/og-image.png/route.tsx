import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAF8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#1E5F4E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            T
          </div>
          <span style={{ fontSize: "48px", fontWeight: "bold", color: "#1A1B1E" }}>
            Tool<span style={{ color: "#1E5F4E" }}>Brigade</span>
          </span>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "#6B6D70",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0",
          }}
        >
          Free browser-based tools for developers &amp; creators.
          No sign-up. No uploads. Instant results.
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
