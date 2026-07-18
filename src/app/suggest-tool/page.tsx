import type { Metadata } from "next";
import SuggestToolForm from "./SuggestToolForm";

export const metadata: Metadata = {
  title: "Suggest a Tool — ToolBrigade",
  description: "Have an idea for a new free browser-based tool? Suggest it and I'll build it.",
  alternates: { canonical: "https://toolbrigade.com/suggest-tool" },
  openGraph: {
    title: "Suggest a Tool — ToolBrigade",
    description: "Have an idea for a new free browser-based tool? Suggest it and I'll build it.",
    url: "https://toolbrigade.com/suggest-tool",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Suggest a Tool — ToolBrigade" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suggest a Tool — ToolBrigade",
    description: "Have an idea for a new free browser-based tool? Suggest it.",
    images: ["/og-image.png"],
  },
};

export default function SuggestToolPage() {
  return <SuggestToolForm />;
}
