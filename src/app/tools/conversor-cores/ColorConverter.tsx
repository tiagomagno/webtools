"use client";

import { useState } from "react";
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, rgbCss, hslCss, type RGB } from "../../lib/color";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <div onClick={copy} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: 14, fontFamily: "monospace", color: "var(--text)" }}>{value} <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{copied ? "✓" : "⧉"}</span></span>
    </div>
  );
}

export default function ColorConverter() {
  const [rgb, setRgb] = useState<RGB>({ r: 99, g: 102, b: 241 });

  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);

  const onHex = (v: string) => { const parsed = hexToRgb(v); if (parsed) setRgb(parsed); };
  const onRgb = (key: keyof RGB, v: number) => setRgb({ ...rgb, [key]: Math.max(0, Math.min(255, v)) });
  const onHsl = (key: "h" | "s" | "l", v: number) => setRgb(hslToRgb({ ...hsl, [key]: v }));

  const slider = (label: string, value: number, max: number, onChange: (v: number) => void) => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
        <span>{label}</span><span style={{ fontFamily: "monospace" }}>{value}</span>
      </div>
      <input type="range" min={0} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%" }} />
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
      <div>
        <div style={{ background: hex, height: 160, borderRadius: 12, border: "1px solid var(--border)", marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
          <input type="color" value={hex} onChange={(e) => onHex(e.target.value)} style={{ width: 48, height: 40, border: "none", background: "none", cursor: "pointer" }} />
          <input value={hex} onChange={(e) => onHex(e.target.value)} style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 15, fontFamily: "monospace" }} />
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>RGB</div>
          {slider("R", rgb.r, 255, (v) => onRgb("r", v))}
          {slider("G", rgb.g, 255, (v) => onRgb("g", v))}
          {slider("B", rgb.b, 255, (v) => onRgb("b", v))}
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginTop: 6 }}>HSL</div>
          {slider("H", hsl.h, 360, (v) => onHsl("h", v))}
          {slider("S", hsl.s, 100, (v) => onHsl("s", v))}
          {slider("L", hsl.l, 100, (v) => onHsl("l", v))}
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <CopyRow label="HEX" value={hex} />
        <CopyRow label="RGB" value={rgbCss(rgb)} />
        <CopyRow label="HSL" value={hslCss(hsl)} />
        <CopyRow label="RGB (valores)" value={`${rgb.r}, ${rgb.g}, ${rgb.b}`} />
        <CopyRow label="HSL (valores)" value={`${hsl.h}, ${hsl.s}, ${hsl.l}`} />
      </div>
    </div>
  );
}
