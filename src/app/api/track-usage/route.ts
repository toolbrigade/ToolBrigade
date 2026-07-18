import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  const { toolSlug, success } = await req.json();

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO tool_usage (tool_slug, success, created_at)
      VALUES (${toolSlug}, ${success}, NOW())
    `;
  } catch (e) {
    // Don't fail the user's request if tracking fails
    console.error("[track-usage]", e);
  }

  return NextResponse.json({ ok: true });
}
