import { ImageResponse } from "next/og";
import { getToolBySlug } from "@/config/tools";

export const runtime = "edge";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const tool = getToolBySlug(params.slug);
  const name = tool?.name ?? "ToolBrigade";
  const category = tool?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "#FAFAF8",
          fontFamily: "serif",
          padding: "60px 80px",
          justifyContent: "space-between",
        }}
      >
        {/* Top: wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#1E5F4E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            T
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#1A1B1E" }}>
            Tool<span style={{ color: "#1E5F4E" }}>Brigade</span>
          </span>
        </div>

        {/* Center: tool name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {category ? (
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#C75D3A",
                textTransform: "uppercase",
                letterSpacing: 3,
              }}
            >
              {category}
            </span>
          ) : null}
          <span
            style={{
              fontSize: name.length > 30 ? 64 : 80,
              fontWeight: 700,
              color: "#1A1B1E",
              lineHeight: 1.1,
            }}
          >
            {name}
          </span>
        </div>

        {/* Bottom: tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 3,
              background: "#C75D3A",
              borderRadius: 2,
            }}
          />
          <span style={{ fontSize: 20, color: "#6B6D70" }}>
            Free · Browser-based · No sign-up
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
