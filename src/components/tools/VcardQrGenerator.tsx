"use client";
import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";

export default function VcardQrGenerator() {
  const [firstName, setFirstName] = useState("Jane");
  const [lastName, setLastName] = useState("Smith");
  const [phone, setPhone] = useState("+1 555 123 4567");
  const [email, setEmail] = useState("jane.smith@example.com");
  const [company, setCompany] = useState("Acme Corp");
  const [title, setTitle] = useState("Product Manager");
  const [website, setWebsite] = useState("https://example.com");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    generateQr();
  }, [firstName, lastName, phone, email, company, title, website]);

  async function generateQr() {
    try {
      const QRCode = (await import("qrcode")).default;
      const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName};${firstName};;;`,
        `FN:${firstName} ${lastName}`,
        company ? `ORG:${company}` : "",
        title ? `TITLE:${title}` : "",
        phone ? `TEL;TYPE=CELL:${phone}` : "",
        email ? `EMAIL:${email}` : "",
        website ? `URL:${website}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");

      const url = await QRCode.toDataURL(vcard, { width: 300, margin: 2 });
      setQrDataUrl(url);
      setError("");
    } catch (e) {
      setError("Failed to generate QR code.");
    }
  }

  function download() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "vcard-qr.png";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-xs text-blue-800 dark:text-blue-300">
        Generates a vCard 3.0 QR code. When scanned, most phones will offer to add the contact directly to the address book.
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">First Name</label>
              <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Last Name</label>
              <input className="input" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Phone</label>
            <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Company</label>
            <input className="input" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Job Title</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Website</label>
            <input className="input" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://example.com" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {qrDataUrl && (
            <>
              <img src={qrDataUrl} alt="vCard QR Code" className="rounded-xl border border-[var(--border)] w-48 h-48" />
              <p className="text-xs text-[var(--text-muted)] text-center">Scan to add contact</p>
              <button onClick={download} className="btn-primary flex items-center gap-2">
                <Download size={16} />Download QR PNG
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
