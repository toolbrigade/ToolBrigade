"use client";
import { useState } from "react";
import { trackTaskComplete } from "@/lib/trackUsage";

type SemVer = { major: number; minor: number; patch: number; pre: string; build: string; raw: string };

function parseSemver(v: string): SemVer | null {
  const match = v.trim().match(/^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.\-]+))?(?:\+([a-zA-Z0-9.\-]+))?$/);
  if (!match) return null;
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
    pre: match[4] ?? "",
    build: match[5] ?? "",
    raw: v.trim(),
  };
}

function comparePreRelease(a: string, b: string): number {
  if (!a && !b) return 0;
  if (!a) return 1;  // no pre-release > has pre-release
  if (!b) return -1;
  const aParts = a.split(".");
  const bParts = b.split(".");
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const ap = aParts[i] ?? "";
    const bp = bParts[i] ?? "";
    if (ap === bp) continue;
    const aNum = /^\d+$/.test(ap);
    const bNum = /^\d+$/.test(bp);
    if (aNum && bNum) return parseInt(ap) - parseInt(bp);
    if (aNum) return -1;
    if (bNum) return 1;
    return ap < bp ? -1 : 1;
  }
  return 0;
}

function compare(a: SemVer, b: SemVer): { result: number; reasons: string[] } {
  const reasons: string[] = [];
  if (a.major !== b.major) {
    reasons.push(`Major version differs: ${a.major} vs ${b.major}`);
    return { result: a.major - b.major, reasons };
  }
  reasons.push(`Major versions equal (${a.major})`);
  if (a.minor !== b.minor) {
    reasons.push(`Minor version differs: ${a.minor} vs ${b.minor}`);
    return { result: a.minor - b.minor, reasons };
  }
  reasons.push(`Minor versions equal (${a.minor})`);
  if (a.patch !== b.patch) {
    reasons.push(`Patch version differs: ${a.patch} vs ${b.patch}`);
    return { result: a.patch - b.patch, reasons };
  }
  reasons.push(`Patch versions equal (${a.patch})`);
  const preResult = comparePreRelease(a.pre, b.pre);
  if (preResult !== 0) {
    reasons.push(`Pre-release differs: "${a.pre || "(none)"}" vs "${b.pre || "(none)"}" — ${!a.pre ? `${a.raw} has no pre-release so it is greater` : !b.pre ? `${b.raw} has no pre-release so it is greater` : `compared identifier by identifier`}`);
    return { result: preResult, reasons };
  }
  if (a.pre) reasons.push(`Pre-release identifiers equal ("${a.pre}")`);
  else reasons.push("No pre-release on either version");
  reasons.push("Build metadata is ignored per semver spec");
  return { result: 0, reasons };
}

export default function SemverComparator() {
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [result, setResult] = useState<{ cmp: number; reasons: string[]; a: SemVer; b: SemVer } | null>(null);
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  function doCompare() {
    setError(""); setResult(null);
    const a = parseSemver(v1);
    const b = parseSemver(v2);
    if (!a) { setError(`"${v1}" is not a valid semver string (expected MAJOR.MINOR.PATCH[-pre][+build])`); return; }
    if (!b) { setError(`"${v2}" is not a valid semver string (expected MAJOR.MINOR.PATCH[-pre][+build])`); return; }
    const { result: cmp, reasons } = compare(a, b);
    setResult({ cmp, reasons, a, b });
    trackTaskComplete("semver-comparator", startTime);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Version A</label>
          <input value={v1} onChange={e => setV1(e.target.value)} onKeyDown={e => e.key === "Enter" && doCompare()}
            className="w-full text-lg font-mono border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
            placeholder="1.2.3" />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Version B</label>
          <input value={v2} onChange={e => setV2(e.target.value)} onKeyDown={e => e.key === "Enter" && doCompare()}
            className="w-full text-lg font-mono border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
            placeholder="2.0.0-beta.1" />
        </div>
      </div>
      <button onClick={doCompare} className="btn-primary">Compare</button>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border text-center ${result.cmp === 0 ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20" : result.cmp > 0 ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"}`}>
            <p className="text-2xl font-bold font-mono text-[var(--text)]">
              {result.cmp === 0 ? `${result.a.raw} = ${result.b.raw}` : result.cmp > 0 ? `${result.a.raw} > ${result.b.raw}` : `${result.a.raw} < ${result.b.raw}`}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {result.cmp === 0 ? "Versions are equal" : result.cmp > 0 ? "Version A is greater" : "Version B is greater"}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Comparison breakdown</p>
            {result.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-[var(--brand)] mt-0.5">→</span>
                <span className="text-[var(--text-muted)]">{r}</span>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[result.a, result.b].map((v, i) => (
              <div key={i} className="border border-[var(--border)] rounded-xl p-3 bg-[var(--surface)]">
                <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Version {i === 0 ? "A" : "B"}: <span className="font-mono text-[var(--text)]">{v.raw}</span></p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[["Major", v.major], ["Minor", v.minor], ["Patch", v.patch]].map(([label, val]) => (
                    <div key={label as string} className="bg-[var(--bg-subtle)] rounded-lg p-2">
                      <p className="text-xs text-[var(--text-muted)]">{label}</p>
                      <p className="text-lg font-bold font-mono text-[var(--text)]">{val}</p>
                    </div>
                  ))}
                </div>
                {v.pre && <p className="text-xs text-[var(--text-muted)] mt-2">Pre-release: <span className="font-mono text-orange-500">{v.pre}</span></p>}
                {v.build && <p className="text-xs text-[var(--text-muted)]">Build: <span className="font-mono">{v.build}</span></p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
