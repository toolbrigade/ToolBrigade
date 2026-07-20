"use client";
import { useState, useCallback } from "react";

type FileEntry = { name: string; size: number; hash: string };

async function hashFile(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function DuplicateFileFinder() {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProcessing(true);
    setProgress(0);
    const results: FileEntry[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const hash = await hashFile(file);
      results.push({ name: file.name, size: file.size, hash });
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }
    setEntries(results);
    setProcessing(false);
  }, []);

  // Group by hash
  const groups = entries.reduce<Record<string, FileEntry[]>>((acc, e) => {
    (acc[e.hash] = acc[e.hash] || []).push(e);
    return acc;
  }, {});
  const duplicateGroups = Object.values(groups).filter(g => g.length > 1);
  const uniqueCount = Object.values(groups).filter(g => g.length === 1).length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-xs text-blue-700 dark:text-blue-300">
        Files are hashed using SHA-256 via the Web Crypto API — entirely in your browser. No files are uploaded or transmitted.
      </div>

      <label className="block border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 transition-colors">
        <input
          type="file"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        <p className="text-[var(--text-muted)] text-sm">Click to select multiple files</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">All file types supported</p>
      </label>

      {processing && (
        <div className="space-y-1">
          <p className="text-sm text-[var(--text-muted)]">Hashing files… {progress}%</p>
          <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {entries.length > 0 && !processing && (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="card"><p className="text-xs text-[var(--text-muted)]">Files scanned</p><p className="text-2xl font-bold text-[var(--text)]">{entries.length}</p></div>
            <div className="card"><p className="text-xs text-[var(--text-muted)]">Duplicate groups</p><p className={`text-2xl font-bold ${duplicateGroups.length > 0 ? "text-red-500" : "text-green-500"}`}>{duplicateGroups.length}</p></div>
            <div className="card"><p className="text-xs text-[var(--text-muted)]">Unique files</p><p className="text-2xl font-bold text-[var(--text)]">{uniqueCount}</p></div>
          </div>

          {duplicateGroups.length === 0 ? (
            <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-5 py-4 text-center text-green-700 dark:text-green-300 font-medium">
              ✓ No duplicate files found
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--text)]">Duplicate groups ({duplicateGroups.length})</p>
              {duplicateGroups.map((group, i) => (
                <div key={i} className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                  <p className="text-xs text-[var(--text-muted)] mb-2 font-mono">SHA-256: {group[0].hash.slice(0, 16)}…</p>
                  {group.map(f => (
                    <div key={f.name} className="flex justify-between text-sm py-1 border-b border-[var(--border)] last:border-0">
                      <span className="text-[var(--text)] truncate">{f.name}</span>
                      <span className="text-[var(--text-muted)] ml-4 shrink-0">{formatSize(f.size)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
