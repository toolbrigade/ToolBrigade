import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.ANALYTICS_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const [topTools, dailyUsage, deviceBreakdown, referrerBreakdown, recentActivity, summary] =
    await Promise.all([
      // Top tools by usage
      sql`
        SELECT tool_slug, 
               COUNT(*) as total_uses,
               COUNT(DISTINCT session_id) as unique_sessions,
               ROUND(AVG(time_spent_seconds)) as avg_time_seconds,
               SUM(CASE WHEN task_completed THEN 1 ELSE 0 END) as completions
        FROM tool_usage
        GROUP BY tool_slug
        ORDER BY total_uses DESC
        LIMIT 20
      `,
      // Daily usage last 30 days
      sql`
        SELECT DATE(created_at) as date, COUNT(*) as uses
        FROM tool_usage
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      // Device breakdown
      sql`
        SELECT device_type, COUNT(*) as count
        FROM tool_usage
        WHERE device_type IS NOT NULL
        GROUP BY device_type
        ORDER BY count DESC
      `,
      // Referrer breakdown
      sql`
        SELECT 
          CASE 
            WHEN referrer = 'direct' OR referrer = '' THEN 'Direct'
            WHEN referrer LIKE '%google%' THEN 'Google'
            WHEN referrer LIKE '%bing%' THEN 'Bing'
            WHEN referrer LIKE '%facebook%' THEN 'Facebook'
            WHEN referrer LIKE '%twitter%' OR referrer LIKE '%t.co%' THEN 'Twitter'
            ELSE 'Other'
          END as source,
          COUNT(*) as count
        FROM tool_usage
        WHERE referrer IS NOT NULL
        GROUP BY source
        ORDER BY count DESC
      `,
      // Recent 20 activities
      sql`
        SELECT tool_slug, device_type, referrer, time_spent_seconds, task_completed, created_at
        FROM tool_usage
        ORDER BY created_at DESC
        LIMIT 20
      `,
      // Overall summary
      sql`
        SELECT 
          COUNT(*) as total_uses,
          COUNT(DISTINCT session_id) as total_sessions,
          COUNT(DISTINCT tool_slug) as tools_used,
          ROUND(AVG(time_spent_seconds)) as avg_time_seconds,
          SUM(CASE WHEN task_completed THEN 1 ELSE 0 END) as total_completions,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as uses_today,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as uses_this_week
        FROM tool_usage
      `,
    ]);

  return NextResponse.json({
    summary: summary[0],
    topTools,
    dailyUsage,
    deviceBreakdown,
    referrerBreakdown,
    recentActivity,
  });
}
