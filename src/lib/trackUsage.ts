declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackUsage(toolSlug: string, success = true) {
  // GA4 custom event
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "tool_used", {
      tool_slug: toolSlug,
      success,
    });
  }

  // Neon DB
  fetch("/api/track-usage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolSlug, success }),
  }).catch(() => {});
}
