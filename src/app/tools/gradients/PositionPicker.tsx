"use client";

const POINTS = [0, 50, 100];

interface PositionPickerProps {
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
}

/** Centro do gradiente: nove atalhos (cantos, lados e centro) e dois ajustes finos. */
export default function PositionPicker({ x, y, onChange }: PositionPickerProps) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <div role="group" aria-label="Posição do centro" style={{ display: "grid", gridTemplateColumns: "repeat(3, 26px)", gap: 4 }}>
        {POINTS.flatMap((py) => POINTS.map((px) => {
          const active = px === x && py === y;
          return (
            <button
              key={`${px}-${py}`} type="button" aria-pressed={active} aria-label={`Centro em ${px}% e ${py}%`}
              onClick={() => onChange(px, py)}
              style={{ width: 26, height: 26, padding: 0, cursor: "pointer", borderRadius: 6, border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`, background: active ? "var(--accent-strong)" : "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "#fff" : "var(--text-subtle)" }} />
            </button>
          );
        }))}
      </div>
      <div style={{ flex: 1, minWidth: 140, display: "flex", flexDirection: "column", gap: 8 }}>
        {([["X", x, (v: number) => onChange(v, y)], ["Y", y, (v: number) => onChange(x, v)]] as const).map(([label, value, set]) => (
          <label key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
            <span style={{ width: 12 }}>{label}</span>
            <input type="range" min={0} max={100} value={value} onChange={(e) => set(Number(e.target.value))} style={{ flex: 1, accentColor: "var(--accent-strong)" }} />
            <span style={{ width: 34, textAlign: "right", fontFamily: "var(--font-kode), ui-monospace, monospace", color: "var(--text)" }}>{value}%</span>
          </label>
        ))}
      </div>
    </div>
  );
}
