"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

interface Field { name: string; value: string; type: string }

export default function PdfFormFiller() {
  const [fields, setFields] = useState<Field[]>([]);
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  async function handleFile(file: File) {
    setLoading(true); setError(""); setFields([]);
    try {
      const ab = await file.arrayBuffer();
      setBuf(ab);
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(ab);
      const form = doc.getForm();
      const detected: Field[] = form.getFields().map(f => ({
        name: f.getName(),
        value: "",
        type: f.constructor.name,
      }));
      if (detected.length === 0) setError("No AcroForm fields detected in this PDF.");
      setFields(detected);
    } catch { setError("Could not read PDF form fields. The PDF may not have AcroForm fields."); }
    setLoading(false);
  }

  async function exportFilled() {
    if (!buf) return;
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(buf);
    const form = doc.getForm();
    for (const f of fields) {
      try {
        const field = form.getField(f.name);
        if (field.constructor.name === "PDFTextField") {
          (form.getTextField(f.name)).setText(f.value);
        } else if (field.constructor.name === "PDFCheckBox" && f.value === "true") {
          form.getCheckBox(f.name).check();
        }
      } catch { /* skip unsupported field types */ }
    }
    form.flatten();
    const bytes = await doc.save();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = "filled.pdf"; a.click();
    trackTaskComplete("pdf-form-filler", startTime);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF with form fields</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Reading form fields…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {fields.length > 0 && (
        <>
          <p className="text-xs text-[var(--text-muted)]">{fields.length} field(s) detected. Fill them below, then export a flattened PDF.</p>
          <div className="space-y-3">
            {fields.map((f, i) => (
              <div key={i}>
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{f.name} <span className="opacity-50">({f.type})</span></label>
                {f.type === "PDFCheckBox" ? (
                  <select className="input" value={f.value} onChange={e => { const c = [...fields]; c[i] = { ...c[i], value: e.target.value }; setFields(c); }}>
                    <option value="">Unchecked</option>
                    <option value="true">Checked</option>
                  </select>
                ) : (
                  <input type="text" className="input" value={f.value} onChange={e => { const c = [...fields]; c[i] = { ...c[i], value: e.target.value }; setFields(c); }} />
                )}
              </div>
            ))}
          </div>
          <button onClick={exportFilled} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />Export Filled & Flattened PDF
          </button>
        </>
      )}
    </div>
  );
}
