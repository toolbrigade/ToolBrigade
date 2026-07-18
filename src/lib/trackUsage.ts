declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return "mobile";
  return "desktop";
}

function getSessionId(): string {
  let sid = sessionStorage.getItem("tb_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("tb_sid", sid);
  }
  return sid;
}

export function trackUsage(
  toolSlug: string,
  success = true,
  taskCompleted = false,
  timeSpentSeconds = 0
) {
  if (typeof window === "undefined") return;

  const sessionId = getSessionId();
  const deviceType = getDeviceType();
  const referrer = document.referrer || "direct";

  // GA4 custom event
  if (window.gtag) {
    window.gtag("event", "tool_used", {
      tool_slug: toolSlug,
      success,
      task_completed: taskCompleted,
      time_spent_seconds: timeSpentSeconds,
      device_type: deviceType,
      session_id: sessionId,
    });
  }

  // Neon DB
  fetch("/api/track-usage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      toolSlug,
      success,
      taskCompleted,
      timeSpentSeconds,
      sessionId,
      deviceType,
      referrer,
    }),
  }).catch(() => {});
}

export function trackTaskComplete(toolSlug: string, startTime: number) {
  const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
  trackUsage(toolSlug, true, true, timeSpentSeconds);
}
