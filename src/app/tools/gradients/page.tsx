"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Stop {
  id: number;
  color: string;
  position: number;
}

type GradientType =
  | "linear"
  | "radial"
  | "conic"
  | "repeating-linear"
  | "repeating-radial"
  | "repeating-conic";

type Animation = "none" | "rotate" | "shift" | "pulse";

const TYPE_LABELS: Record<GradientType, string> = {
  linear: "Linear",
  radial: "Radial",
  conic: "Cônico",
  "repeating-linear": "Rep. Linear",
  "repeating-radial": "Rep. Radial",
  "repeating-conic": "Rep. Cônico",
};

const ANIMATION_LABELS: Record<Animation, { label: string; desc: string }> = {
  none: { label: "Nenhuma", desc: "" },
  rotate: { label: "Rotate", desc: "Gira o ângulo continuamente" },
  shift: { label: "Shift", desc: "Move o gradiente em diagonal" },
  pulse: { label: "Pulse", desc: "Pulsa a opacidade suavemente" },
};

const ANIMATION_DURATIONS: Record<Animation, string> = {
  none: "",
  rotate: "4s",
  shift: "6s",
  pulse: "3s",
};

let nextId = 3;

function buildGradient(
  type: GradientType,
  angle: number,
  stops: Stop[],
  animAngle?: number
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
  const deg = animAngle ?? angle;

  switch (type) {
    case "linear":
      return `linear-gradient(${deg}deg, ${stopsStr})`;
    case "radial":
      return `radial-gradient(circle, ${stopsStr})`;
    case "conic":
      return `conic-gradient(from ${deg}deg, ${stopsStr})`;
    case "repeating-linear":
      return `repeating-linear-gradient(${deg}deg, ${stopsStr})`;
    case "repeating-radial":
      return `repeating-radial-gradient(circle, ${stopsStr})`;
    case "repeating-conic":
      return `repeating-conic-gradient(from ${deg}deg, ${stopsStr})`;
  }
}

function buildCssOutput(
  type: GradientType,
  angle: number,
  stops: Stop[],
  animation: Animation,
  duration: number
): string {
  const gradient = buildGradient(type, angle, stops);
  const dur = `${duration}s`;

  if (animation === "none") {
    return `background: ${gradient};`;
  }

  if (animation === "rotate") {
    const isAngleBased = type === "linear" || type === "conic" || type === "repeating-linear" || type === "repeating-conic";
    if (isAngleBased) {
      return `.element {
  background: ${gradient};
  animation: gradient-rotate ${dur} linear infinite;
}

@keyframes gradient-rotate {
  from { background: ${buildGradient(type, 0, stops)}; }
  to   { background: ${buildGradient(type, 360, stops)}; }
}`;
    }
    return `/* Rotate não se aplica a gradientes radiais — use Shift */\nbackground: ${gradient};`;
  }

  if (animation === "shift") {
    return `.element {
  background: ${gradient};
  background-size: 300% 300%;
  animation: gradient-shift ${dur} ease infinite;
}

@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;
  }

  if (animation === "pulse") {
    return `.element {
  background: ${gradient};
  animation: gradient-pulse ${dur} ease-in-out infinite;
}

@keyframes gradient-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}`;
  }

  return `background: ${gradient};`;
}

export default function GradientsPage() {
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<GradientType>("linear");
  const [stops, setStops] = useState<Stop[]>([
    { id: 1, color: "#6366f1", position: 0 },
    { id: 2, color: "#ec4899", position: 100 },
  ]);
  const [animation, setAnimation] = useState<Animation>("none");
  const [duration, setDuration] = useState(4);
  const [copied, setCopied] = useState(false);
  const [animAngle, setAnimAngle] = useState(angle);
  const [opacity, setOpacity] = useState(1);
  const [bgPos, setBgPos] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const isAngleBased = ["linear", "conic", "repeating-linear", "repeating-conic"].includes(type);

  // Live animation in preview
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setAnimAngle(angle);
    setOpacity(1);
    setBgPos(0);
    if (animation === "none") return;

    const loop = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const cycle = (elapsed % duration) / duration;

      if (animation === "rotate") setAnimAngle(Math.round(cycle * 360));
      if (animation === "shift") setBgPos(Math.sin(cycle * Math.PI * 2) * 0.5 + 0.5);
      if (animation === "pulse") setOpacity(0.5 + Math.sin(cycle * Math.PI * 2) * 0.5 * 0.5 + 0.25);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animation, duration, angle]);

  const previewGradient = buildGradient(type, angle, stops, animation === "rotate" && isAngleBased ? animAngle : undefined);
  const previewStyle: React.CSSProperties = {
    background: animation === "shift"
      ? `${previewGradient}`
      : previewGradient,
    backgroundSize: animation === "shift" ? "300% 300%" : undefined,
    backgroundPosition: animation === "shift" ? `${bgPos * 100}% 50%` : undefined,
    opacity: animation === "pulse" ? opacity : 1,
  };

  const cssOutput = buildCssOutput(type, angle, stops, animation, duration);

  const copy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const updateStop = (id: number, field: keyof Stop, value: string | number) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addStop = () => {
    const mid = sortedStops.length > 1
      ? Math.round((sortedStops[0].position + sortedStops[sortedStops.length - 1].position) / 2)
      : 50;
    setStops((prev) => [...prev, { id: nextId++, color: "#ffffff", position: mid }]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>
          ← Ferramentas
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🌈 Gerador de Gradientes
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Crie gradientes CSS com controle visual e copie o código pronto.
        </p>
      </div>

      {/* Preview */}
      <div
        style={{
          height: 200,
          borderRadius: 16,
          border: "1px solid var(--border)",
          marginBottom: 24,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, ...previewStyle, transition: animation === "none" ? "background 0.2s" : undefined }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Type */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>TIPO</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(Object.keys(TYPE_LABELS) as GradientType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: type === t ? "var(--accent)" : "var(--border)",
                    background: type === t ? "var(--accent)" : "var(--surface-2)",
                    color: type === t ? "#fff" : "var(--text-muted)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.1s",
                  }}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {isAngleBased && (
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>
                ÂNGULO — {animation === "rotate" ? `${animAngle}°` : `${angle}°`}
              </div>
              <input
                type="range" min={0} max={360} value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>

        {/* Animation */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, fontWeight: 500 }}>ANIMAÇÃO</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: animation !== "none" ? 16 : 0 }}>
            {(Object.keys(ANIMATION_LABELS) as Animation[]).map((a) => (
              <button
                key={a}
                onClick={() => setAnimation(a)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: "1px solid",
                  borderColor: animation === a ? "#0ea5e9" : "var(--border)",
                  background: animation === a ? "#0ea5e920" : "var(--surface-2)",
                  color: animation === a ? "#0ea5e9" : "var(--text-muted)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.1s",
                }}
              >
                {ANIMATION_LABELS[a].label}
              </button>
            ))}
          </div>
          {animation !== "none" && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {ANIMATION_LABELS[animation].desc}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Duração</span>
                <input
                  type="range" min={1} max={20} value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  style={{ width: 100 }}
                />
                <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text)", minWidth: 28 }}>{duration}s</span>
              </div>
            </div>
          )}
        </div>

        {/* Stops */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>COLOR STOPS</span>
            <button
              onClick={addStop}
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "var(--text)", cursor: "pointer" }}
            >
              + Adicionar stop
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sortedStops.map((stop) => (
              <div key={stop.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="color" value={stop.color}
                  onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                  style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid var(--border)", background: "none", cursor: "pointer", padding: 2, flexShrink: 0 }}
                />
                <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-muted)", minWidth: 70 }}>{stop.color}</span>
                <input
                  type="range" min={0} max={100} value={stop.position}
                  onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-muted)", minWidth: 36 }}>{stop.position}%</span>
                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  style={{ background: "none", border: "none", color: stops.length <= 2 ? "var(--text-subtle)" : "var(--text-muted)", cursor: stops.length <= 2 ? "not-allowed" : "pointer", fontSize: 16, lineHeight: 1, padding: "0 4px" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Output */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>CSS</span>
            <button
              onClick={copy}
              style={{ background: copied ? "#10b981" : "var(--accent)", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", transition: "background 0.2s" }}
            >
              {copied ? "✓ Copiado!" : "Copiar CSS"}
            </button>
          </div>
          <pre
            style={{ display: "block", background: "var(--surface-2)", borderRadius: 8, padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: "var(--text)", wordBreak: "break-all", lineHeight: 1.7, margin: 0, overflowX: "auto", whiteSpace: "pre-wrap" }}
          >
            {cssOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
