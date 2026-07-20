"use client";
import { useState, useEffect } from "react";
import { Download, Eye, EyeOff } from "lucide-react";

export default function WifiQrGenerator() {
  const [ssid, setSsid] = useState("MyNetwork");
  const [password, setPassword] = useState("mypassword123");
  const [security, setSecurity] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [hidden, setHidden] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { generateQr(); }, [ssid, password, security, hidden]);

  async function generateQr() {
    try {
      const QRCode = (await import("qrcode")).default;
      // Standard WIFI: QR format
      const escape = (s: string) => s.replace(/[\\;,"]/g, c => "\\" + c);
      const wifiString = `WIFI:T:${security};S:${escape(ssid)};P:${escape(password)};H:${hidden ? "true" : "false"};;`;
      const url = await QRCode.toDataURL(wifiString, { width: 300, margin: 2 });
      setQrDataUrl(url);
      setError("");
    } catch {
      setError("Failed to generate QR code.");
    }
  }

  function download() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "wifi-qr.png";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-xs text-blue-800 dark:text-blue-300">
        Generates a standard WIFI: format QR code. When scanned on Android or iOS, the device will offer to join the network automatically.
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Network Name (SSID)</label>
            <input className="input" value={ssid} onChange={e => setSsid(e.target.value)} placeholder="MyNetwork" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Security Type</label>
            <select className="input" value={security} onChange={e => setSecurity(e.target.value as "WPA" | "WEP" | "nopass")}>
              <option value="WPA">WPA/WPA2/WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password (Open)</option>
            </select>
          </div>
          {security !== "nopass" && (
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={hidden} onChange={e => setHidden(e.target.checked)} className="rounded" />
            <span className="text-[var(--text)]">Hidden network</span>
          </label>
        </div>
        <div className="flex flex-col items-center gap-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {qrDataUrl && (
            <>
              <img src={qrDataUrl} alt="WiFi QR Code" className="rounded-xl border border-[var(--border)] w-48 h-48" />
              <p className="text-xs text-[var(--text-muted)] text-center">Scan to connect to <strong>{ssid}</strong></p>
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
