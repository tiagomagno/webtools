"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

type ECLevel = "L" | "M" | "Q" | "H";

export default function QrGenerator() {
  const [text, setText] = useState("https://exemplo.com");
  const [size, setSize] = useState(320);
  const [ec, setEc] = useState<ECLevel>("M");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!text.trim()) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setError("");
      return;
    }
    QRCode.toCanvas(canvas, text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: ec,
      color: { dark: fg, light: bg },
    }).then(() => setError("")).catch((e) => setError(e instanceof Error ? e.message : "Erro ao gerar QR."));
  }, [text, size, ec, fg, bg]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  };

  const downloadSvg = async () => {
    if (!text.trim()) return;
    const svg = await QRCode.toString(text, { type: "svg", errorCorrectionLevel: ec, margin: 2, color: { dark: fg, light: bg } });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "block" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={labelStyle}>TEXTO OU URL</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} style={{ width: "100%", minHeight: 90, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, color: "var(--text)", fontSize: 14, lineHeight: 1.6, resize: "vertical", fontFamily: "inherit" }} />
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, display: "grid", gap: 16 }}>
          <div>
            <label style={labelStyle}>TAMANHO — {size}px</label>
            <input type="range" min={128} max={1024} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <label style={labelStyle}>CORREÇÃO DE ERRO</label>
            <div style={{ display: "flex", gap: 6 }}>
              {(["L", "M", "Q", "H"] as ECLevel[]).map((l) => (
                <button key={l} onClick={() => setEc(l)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "1px solid", borderColor: ec === l ? "var(--accent)" : "var(--border)", background: ec === l ? "var(--accent)" : "var(--surface-2)", color: ec === l ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {l}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 6 }}>L: 7% · M: 15% · Q: 25% · H: 30% de recuperação</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
              Frente <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} style={{ width: 36, height: 28, border: "none", background: "none", cursor: "pointer" }} />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
              Fundo <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} style={{ width: 36, height: 28, border: "none", background: "none", cursor: "pointer" }} />
            </label>
          </div>
        </div>
        {error && <div style={{ color: "#ef4444", fontSize: 13 }}>{error}</div>}
      </div>

      <div style={{ position: "sticky", top: 20 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={downloadPng} style={{ flex: 1, background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>↓ PNG</button>
          <button onClick={downloadSvg} style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer" }}>↓ SVG</button>
        </div>
      </div>
    </div>
  );
}
