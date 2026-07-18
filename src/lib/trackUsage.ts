export function trackUsage(toolSlug: string, success = true) {
  fetch("/api/track-usage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolSlug, success }),
  }).catch(() => {});
}
