"use client";

import { useEffect, useRef } from "react";
import { hexToHsv, hsvToHex } from "../../lib/palette";

const SIZE = 300;
const R = SIZE / 2;

interface ColorWheelProps {
  /** Cor base (marcador maior). */
  base: string;
  /** Todas as cores da paleta, cada uma com seu marcador na roda. */
  colors: string[];
  onChange: (hex: string) => void;
}

/** Roda de cores: ângulo = matiz, raio = saturação; o controle abaixo ajusta o brilho. */
export default function ColorWheel({ base, colors, onChange }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);
  const [bh, bs, bv] = hexToHsv(base);

  // A roda só depende do brilho: redesenha quando ele muda.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(SIZE, SIZE);
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = x + 0.5 - R, dy = y + 0.5 - R;
        const dist = Math.hypot(dx, dy);
        const i = (y * SIZE + x) * 4;
        if (dist > R) { img.data[i + 3] = 0; continue; }
        const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
        const hex = hsvToHex(hue, (dist / R) * 100, bv);
        img.data[i] = parseInt(hex.slice(1, 3), 16);
        img.data[i + 1] = parseInt(hex.slice(3, 5), 16);
        img.data[i + 2] = parseInt(hex.slice(5, 7), 16);
        img.data[i + 3] = Math.min(255, (R - dist) * 255);
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [bv]);

  const pick = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = SIZE / rect.width;
    const dx = (e.clientX - rect.left) * scale - R, dy = (e.clientY - rect.top) * scale - R;
    const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
    onChange(hsvToHex(hue, Math.min(100, (Math.hypot(dx, dy) / R) * 100), bv));
  };

  const markerStyle = (hex: string, isBase: boolean): React.CSSProperties => {
    const [h, s] = hexToHsv(hex);
    const rad = (h * Math.PI) / 180;
    const dist = (s / 100) * 50; // % do raio, em unidades de largura (roda = 100%)
    return {
      position: "absolute",
      left: `${50 + dist * Math.cos(rad)}%`,
      top: `${50 + dist * Math.sin(rad)}%`,
      width: isBase ? 22 : 16, height: isBase ? 22 : 16,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%", background: hex,
      border: `${isBase ? 3 : 2}px solid #fff`,
      boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
      pointerEvents: "none",
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        role="img"
        aria-label={`Roda de cores. Cor base ${base.toUpperCase()}: matiz ${bh} graus, saturação ${bs}%.`}
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); pick(e); }}
        onPointerMove={(e) => { if (dragging.current) pick(e); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
        style={{ position: "relative", width: "100%", maxWidth: SIZE, aspectRatio: "1", cursor: "crosshair", touchAction: "none", userSelect: "none" }}
      >
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ width: "100%", height: "100%", display: "block", borderRadius: "50%" }} />
        {colors.map((c, i) => <span key={`${c}-${i}`} style={markerStyle(c, false)} />)}
        <span style={markerStyle(base, true)} />
      </div>

      <label style={{ width: "100%", maxWidth: SIZE, display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Brilho</span>
          <span style={{ fontFamily: "var(--font-kode), monospace" }}>{bv}%</span>
        </span>
        <input
          type="range" min={5} max={100} value={bv}
          onChange={(e) => onChange(hsvToHex(bh, bs, Number(e.target.value)))}
          style={{ width: "100%", accentColor: "var(--accent-strong)" }}
        />
      </label>
    </div>
  );
}
