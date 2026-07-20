"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

type IpData = {
  query: string; status: string; country: string; countryCode: string;
  regionName: string; city: string; zip: string; lat: number; lon: number;
  timezone: string; isp: string; org: string; as: string;
};

export default function IpLookup() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup() {
    const target = input.trim() || "";
    setLoading(true); setError(""); setData(null);
    try {
      const url = target
        ? `https://ip-api.com/json/${encodeURIComponent(target)}`
        : "https://ip-api.com/json/";
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const json: IpData = await res.json();
      if (json.status === "fail") throw new Error("Invalid IP address or lookup failed");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed — please try again.");
    }
    setLoading(false);
  }

  const fields: [string, string][] = data ? [
    ["IP Address", data.query],
    ["Country", `${data.country} (${data.countryCode})`],
    ["Region", data.regionName],
    ["City", data.city],
    ["Postal Code", data.zip],
    ["Coordinates", `${data.lat}, ${data.lon}`],
    ["Timezone", data.timezone],
    ["ISP", data.isp],
    ["Organisation", data.org],
    ["AS", data.as],
  ] : [];

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-xs text-amber-800 dark:text-amber-200 space-y-1">
        <p className="font-semibold">⚠️ Requires internet connection — external API call</p>
        <p>This tool sends the queried IP address to <strong>ip-api.com</strong> to retrieve geolocation data. If you look up your own IP (leave the field blank), your IP address is sent to ip-api.com. See the <a href="/privacy" className="underline">Privacy Policy</a> for details. ip-api.com is a free geolocation service — see their terms at <a href="https://ip-api.com/docs/legal" className="underline" target="_blank" rel="noopener noreferrer">ip-api.com/docs/legal</a>.</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="input flex-1 font-mono"
          placeholder="Leave blank to look up your own IP, or enter an IP address"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup()}
        />
        <button onClick={lookup} disabled={loading} className="btn-primary flex items-center gap-2 shrink-0">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Looking up…" : "Look Up"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <div className="card divide-y divide-[var(--border)]">
          {fields.map(([label, value]) => value && (
            <div key={label} className="flex justify-between py-2 text-sm">
              <span className="text-[var(--text-muted)]">{label}</span>
              <span className="font-medium text-[var(--text)] text-right ml-4">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
