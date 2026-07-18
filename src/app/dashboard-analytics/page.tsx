"use client";

import { useState, useEffect, useCallback } from "react";

type Summary = {
  total_uses: number;
  total_sessions: number;
  tools_used: number;
  avg_time_seconds: number;
  total_completions: number;
  uses_today: number;
  uses_this_week: number;
};

type ToolStat = {
  tool_slug: string;
  total_uses: number;
  unique_sessions: number;
  avg_time_seconds: number;
  completions: number;
};

type DailyUsage = { date: string; uses: number };
type BreakdownItem = { source?: string; device_type?: string; count: number };
type RecentItem = {
  tool_slug: string;
  device_type: string;
  referrer: string;
  time_spent_seconds: number;
  task_completed: boolean;
  created_at: string;
};

type AnalyticsData = {
  summary: Summary;
  topTools: ToolStat[];
  dailyUsage: DailyUsage[];
  deviceBreakdown: BreakdownItem[];
  referrerBreakdown: BreakdownItem[];
  recentActivity: RecentItem[];
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
      <p className="text-sm text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function BarChart({ data, labelKey, valueKey }: { data: Record<string, unknown>[]; labelKey: string; valueKey: string }) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])));
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)] w-32 truncate shrink-0">
            {String(item[labelKey])}
          </span>
          <div className="flex-1 bg-[var(--border)] rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${(Number(item[valueKey]) / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[var(--text-primary)] w-10 text-right">
            {Number(item[valueKey]).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniLineChart({ data }: { data: DailyUsage[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.uses));
  const w = 600;
  const h = 80;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (d.uses / max) * h;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        points={points.join(" ")}
      />
      <polyline
        fill="rgba(59,130,246,0.1)"
        stroke="none"
        points={`0,${h} ${points.join(" ")} ${w},${h}`}
      />
    </svg>
  );
}

export default function AnalyticsDashboard() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (secretKey: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/analytics?key=${encodeURIComponent(secretKey)}`);
      if (res.status === 401) { setError("Invalid key"); setLoading(false); return; }
      const json = await res.json();
      setData(json);
      setAuthed(true);
      sessionStorage.setItem("analytics_key", secretKey);
    } catch {
      setError("Failed to load data");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("analytics_key");
    if (saved) fetchData(saved);
  }, [fetchData]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 w-full max-w-sm space-y-4">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Analytics</h1>
          <input
            type="password"
            placeholder="Enter secret key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData(key)}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-primary)] outline-none focus:border-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={() => fetchData(key)}
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : "Enter"}
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { summary, topTools, dailyUsage, deviceBreakdown, referrerBreakdown, recentActivity } = data;

  return (
    <div className="min-h-screen bg-[var(--bg)] p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h1>
        <button
          onClick={() => { sessionStorage.removeItem("analytics_key"); setAuthed(false); setData(null); }}
          className="text-sm text-[var(--text-muted)] hover:text-red-500"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Uses" value={Number(summary.total_uses).toLocaleString()} />
        <StatCard label="Today" value={Number(summary.uses_today).toLocaleString()} />
        <StatCard label="This Week" value={Number(summary.uses_this_week).toLocaleString()} />
        <StatCard label="Unique Sessions" value={Number(summary.total_sessions).toLocaleString()} />
        <StatCard label="Tools Used" value={summary.tools_used} />
        <StatCard label="Avg Time (sec)" value={summary.avg_time_seconds ?? 0} />
        <StatCard label="Completions" value={Number(summary.total_completions).toLocaleString()} />
        <StatCard
          label="Completion Rate"
          value={
            summary.total_uses > 0
              ? `${Math.round((Number(summary.total_completions) / Number(summary.total_uses)) * 100)}%`
              : "0%"
          }
        />
      </div>

      {/* Daily Usage Chart */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="font-semibold text-[var(--text-primary)] mb-4">Daily Usage — Last 30 Days</h2>
        <MiniLineChart data={dailyUsage} />
        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
          <span>{dailyUsage[0]?.date}</span>
          <span>{dailyUsage[dailyUsage.length - 1]?.date}</span>
        </div>
      </div>

      {/* Top Tools + Device + Referrer */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Device Breakdown</h2>
          <BarChart data={deviceBreakdown as Record<string, unknown>[]} labelKey="device_type" valueKey="count" />
        </div>
        <div className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Traffic Sources</h2>
          <BarChart data={referrerBreakdown as Record<string, unknown>[]} labelKey="source" valueKey="count" />
        </div>
      </div>

      {/* Top Tools Table */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="font-semibold text-[var(--text-primary)] mb-4">Top Tools</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">Tool</th>
                <th className="pb-2 font-medium text-right">Uses</th>
                <th className="pb-2 font-medium text-right">Sessions</th>
                <th className="pb-2 font-medium text-right">Avg Time</th>
                <th className="pb-2 font-medium text-right">Completions</th>
              </tr>
            </thead>
            <tbody>
              {topTools.map((t, i) => (
                <tr key={t.tool_slug} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 text-[var(--text-muted)]">{i + 1}</td>
                  <td className="py-2 font-medium text-[var(--text-primary)]">{t.tool_slug}</td>
                  <td className="py-2 text-right">{Number(t.total_uses).toLocaleString()}</td>
                  <td className="py-2 text-right">{Number(t.unique_sessions).toLocaleString()}</td>
                  <td className="py-2 text-right">{t.avg_time_seconds ?? 0}s</td>
                  <td className="py-2 text-right">{Number(t.completions).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="pb-2 font-medium">Tool</th>
                <th className="pb-2 font-medium">Device</th>
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 font-medium text-right">Time</th>
                <th className="pb-2 font-medium text-right">Done</th>
                <th className="pb-2 font-medium text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((r, i) => (
                <tr key={i} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 font-medium text-[var(--text-primary)]">{r.tool_slug}</td>
                  <td className="py-2 text-[var(--text-muted)]">{r.device_type ?? "—"}</td>
                  <td className="py-2 text-[var(--text-muted)] max-w-[120px] truncate">{r.referrer || "direct"}</td>
                  <td className="py-2 text-right">{r.time_spent_seconds ?? 0}s</td>
                  <td className="py-2 text-right">{r.task_completed ? "✅" : "—"}</td>
                  <td className="py-2 text-right text-[var(--text-muted)]">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
