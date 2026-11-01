"use client";

import { useEffect, useRef, useState } from "react";
import { Eyedropper } from "@phosphor-icons/react";
import { formatColor, hexToHsv, hsvToHex, parseColorInput, type ColorFormat } from "../../lib/palette";

const FORMATS: { id: ColorFormat; label: string; placeholder: string }[] = [
  { id: "hex", label: "HEX", placeholder: "#426DB3" },
  { id: "rgb", label: "RGB", placeholder: "66, 109, 179" },
  { id: "hsl", label: "HSL", placeholder: "217, 46%, 48%" },
];

interface BaseColorPickerProps {
  hex: string;
  onChange: (hex: string) => void;
  hasEyeDropper: boolean;
  onEyeDropper: () => void;
}

/** Modo Cor base: campo de texto (HEX, RGB ou HSL), quadro de saturação/brilho e controle de matiz. */
export default function BaseColorPicker({ hex, onChange, hasEyeDropper, onEyeDropper }: BaseColorPickerProps) {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [text, setText] = useState(formatColor(hex, "hex"));
  const [h, s, v] = hexToHsv(hex);
  // O matiz se perde em cinza e preto; guardamos o último para o controle não "pular".
  const [hue, setHue] = useState(h);
  const dragging = useRef(false);

  useEffect(() => { setText(formatColor(hex, format)); if (s > 0 && v > 0) setHue(h); }, [hex, format, h, s, v]);

  const update = (value: string) => {
    setText(value);
    const parsed = parseColorInput(format, value);
    if (parsed) onChange(parsed);
  };

  const pickSquare = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sat = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const val = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    onChange(hsvToHex(hue, Math.round(sat * 100), Math.round(val * 100)));
  };

  const valid = parseColorInput(format, text) !== null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label htmlFor="cp-base-input" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>Cor base</label>
        <select
          value={format} onChange={(e) => setFormat(e.target.value as ColorFormat)} aria-label="Formato da cor"
          style={{ fontSize: 12, fontWeight: 600, padding: "4px 8px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}
        >
          {FORMATS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10, height: 42, padding: "0 12px", background: "var(--surface-2)", border: `1px solid ${valid ? "var(--border)" : "#ef444466"}`, borderRadius: 8 }}>
          <span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: "50%", background: hex, flexShrink: 0, border: "1px solid rgba(128,128,128,0.4)" }} />
          <input
            id="cp-base-input" type="text" value={text} spellCheck={false} placeholder={FORMATS.find((f) => f.id === format)?.placeholder}
            onChange={(e) => update(e.target.value)}
            style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "none", color: "var(--text)", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-kode), ui-monospace, monospace" }}
          />
        </div>
        {hasEyeDropper && (
          <button type="button" onClick={onEyeDropper} title="Conta-gotas" aria-label="Conta-gotas"
            style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface-2)", color: "var(--text-muted)", flexShrink: 0 }}>
            <Eyedropper size={18} />
          </button>
        )}
      </div>

      {/* Quadro: saturação na horizontal, brilho na vertical */}
      <div
        role="img" aria-label={`Quadro de saturação e brilho. Saturação ${s}%, brilho ${v}%.`}
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); pickSquare(e); }}
        onPointerMove={(e) => { if (dragging.current) pickSquare(e); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
        style={{ position: "relative", height: 160, borderRadius: 8, cursor: "crosshair", touchAction: "none", userSelect: "none", background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))` }}
      >
        <span style={{ position: "absolute", left: `${s}%`, top: `${100 - v}%`, width: 18, height: 18, transform: "translate(-50%, -50%)", borderRadius: "50%", border: "3px solid #fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.4)", background: hex, pointerEvents: "none" }} />
      </div>

      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
        Matiz
        <input
          type="range" min={0} max={359} value={hue}
          onChange={(e) => { const nh = Number(e.target.value); setHue(nh); onChange(hsvToHex(nh, s, v)); }}
          style={{ width: "100%", height: 10, appearance: "none", borderRadius: 6, cursor: "pointer", background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }}
        />
      </label>
    </div>
  );
}
