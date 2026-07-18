import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E5F4E",
          borderRadius: 40,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={120}
          height={120}
        >
          <rect x="6" y="7" width="20" height="3.5" rx="1.2" fill="white" />
          <rect x="14.5" y="10.5" width="3" height="7" rx="1" fill="white" />
          <rect x="14.5" y="18.5" width="3" height="7" rx="1" fill="white" />
          <path d="M14.5 18.5 h5 a2.25 2.25 0 0 1 0 4 h-5 z" fill="white" />
          <path d="M14.5 22.5 h5.5 a2.5 2.5 0 0 1 0 3.5 h-5.5 z" fill="white" />
        </svg>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
