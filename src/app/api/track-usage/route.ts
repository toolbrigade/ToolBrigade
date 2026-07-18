import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  const {
    toolSlug,
    success,
    taskCompleted,
    timeSpentSeconds,
    sessionId,
    deviceType,
    referrer,
  } = await req.json();

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO tool_usage (tool_slug, success, task_completed, time_spent_seconds, session_id, device_type, referrer, created_at)
      VALUES (${toolSlug}, ${success}, ${taskCompleted ?? false}, ${timeSpentSeconds ?? 0}, ${sessionId}, ${deviceType}, ${referrer}, NOW())
    `;
  } catch (e) {
    console.error("[track-usage]", e);
  }

  return NextResponse.json({ ok: true });
}
