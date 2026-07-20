"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function YamlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  async function format() {
    setError(""); setOutput("");
    try {
      const yaml = await import("js-yaml");
      const parsed = yaml.load(input);
      setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1 }));
      trackTaskComplete("yaml-formatter", startTime);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    }
  }

  async function validate() {
    setError(""); setOutput("");
    try {
      const yaml = await import("js-yaml");
      yaml.load(input);
      setOutput("✓ Valid YAML");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input YAML</label>
          <textarea
            className="textarea min-h-[280px] font-mono text-sm"
            placeholder={"name: John\nage: 30\nhobbies:\n  - reading\n  - coding"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Formatted Output</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[280px] font-mono text-sm" value={output} readOnly placeholder="Formatted YAML appears here…" />
        </div>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap">{error}</p>
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={format} className="btn-primary text-sm">Format / Beautify</button>
        <button onClick={validate} className="btn-secondary text-sm">Validate Only</button>
      </div>
    </div>
  );
}
