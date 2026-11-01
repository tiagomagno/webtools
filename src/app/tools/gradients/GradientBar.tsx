"use client";

import { useRef } from "react";
import { gradientFunction, type GradientConfig, type Stop } from "../../lib/gradient";

interface GradientBarProps {
  cfg: GradientConfig;
  selectedId: number;
  onSelect: (id: number) => void;
  onMove: (id: number, position: number) => void;
  /** Clique na barra, fora de uma cor: cria uma nova parada nessa posição. */
  onAdd: (position: number) => void;
}

/** Barra do gradiente com as cores como alças: arraste para mover, clique na barra para adicionar. */
export default function GradientBar({ cfg, selectedId, onSelect, onMove, onAdd }: GradientBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<number | null>(null);

  const positionFrom = (clientX: number) => {
    const rect = barRef.current!.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 100);
  };

  // A barra mostra sempre uma linha horizontal com as mesmas cores, no mesmo espaço de cor.
  const barCss = gradientFunction({ ...cfg, type: "linear", angle: 90, hard: cfg.hard, period: 100 });

  const handleKey = (e: React.KeyboardEvent, s: Stop) => {
    const step = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); onMove(s.id, Math.max(0, s.position - step)); }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); onMove(s.id, Math.min(100, s.position + step)); }
  };

  return (
    <div style={{ padding: "0 10px" }}>
      <div
        ref={barRef}
        onClick={(e) => { if (e.target === e.currentTarget) onAdd(positionFrom(e.clientX)); }}
        title="Clique para adicionar uma cor"
        style={{ position: "relative", height: 32, borderRadius: 8, border: "1px solid var(--border)", cursor: "copy", backgroundImage: `${barCss}, repeating-conic-gradient(#d4d4d8 0% 25%, #fff 0% 50%)`, backgroundSize: "100% 100%, 12px 12px" }}
      >
        {cfg.stops.map((s) => {
          const selected = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              role="slider"
              aria-label={`Cor ${s.color.toUpperCase()}`}
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.position}
              onPointerDown={(e) => { e.stopPropagation(); dragging.current = s.id; e.currentTarget.setPointerCapture(e.pointerId); onSelect(s.id); }}
              onPointerMove={(e) => { if (dragging.current === s.id) onMove(s.id, positionFrom(e.clientX)); }}
              onPointerUp={() => { dragging.current = null; }}
              onPointerCancel={() => { dragging.current = null; }}
              onKeyDown={(e) => handleKey(e, s)}
              onFocus={() => onSelect(s.id)}
              style={{ position: "absolute", left: `${s.position}%`, top: "50%", width: 22, height: 40, transform: "translate(-50%, -50%)", padding: 0, border: "none", background: "none", cursor: "grab", touchAction: "none", zIndex: selected ? 2 : 1 }}
            >
              <span style={{ display: "block", margin: "0 auto", width: 18, height: 34, borderRadius: 6, background: s.color, border: `3px solid ${selected ? "var(--text)" : "#fff"}`, boxShadow: "0 0 0 1px rgba(0,0,0,0.45)" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
