"use client";

import { useState } from "react";

type Mode = "names" | "number";

/** Inteiro aleatório uniforme em [0, max) via crypto. */
function randInt(max: number): number {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let x: number;
  do { crypto.getRandomValues(arr); x = arr[0]; } while (x >= limit);
  return x % max;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Sorteador() {
  const [mode, setMode] = useState<Mode>("names");
  const [list, setList] = useState("Ana\nBruno\nCarla\nDaniel\nEduarda");
  const [pickCount, setPickCount] = useState(1);
  const [unique, setUnique] = useState(true);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState("");

  const items = list.split("\n").map((l) => l.trim()).filter(Boolean);

  const drawNames = () => {
    setError("");
    if (items.length === 0) { setError("Adicione ao menos um item."); return; }
    const n = Math.max(1, pickCount);
    if (unique) {
      if (n > items.length) { setError("Quantidade maior que o número de itens (com 'sem repetição')."); return; }
      setResult(shuffle(items).slice(0, n));
    } else {
      setResult(Array.from({ length: n }, () => items[randInt(items.length)]));
    }
  };

  const drawNumber = () => {
    setError("");
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const range = hi - lo + 1;
    const n = Math.max(1, pickCount);
    if (unique && n > range) { setError("Quantidade maior que o intervalo disponível (sem repetição)."); return; }
    if (unique) {
      const pool = Array.from({ length: range }, (_, i) => lo + i);
      setResult(shuffle(pool).slice(0, n).map(String));
    } else {
      setResult(Array.from({ length: n }, () => String(lo + randInt(range))));
    }
  };

  const draw = () => (mode === "names" ? drawNames() : drawNumber());

  const seg = (active: boolean): React.CSSProperties => ({ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: active ? "var(--accent)" : "var(--border)", background: active ? "var(--accent)" : "var(--surface-2)", color: active ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" });
  const numInput: React.CSSProperties = { width: 100, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { setMode("names"); setResult([]); }} style={seg(mode === "names")}>Nomes / itens</button>
        <button onClick={() => { setMode("number"); setResult([]); }} style={seg(mode === "number")}>Números</button>
      </div>

      {mode === "names" ? (
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>ITENS (um por linha)</label>
          <textarea value={list} onChange={(e) => setList(e.target.value)} spellCheck={false} style={{ width: "100%", minHeight: 160, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, color: "var(--text)", fontSize: 14, lineHeight: 1.7, resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 6 }}>{items.length} item(ns)</div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>MÍNIMO</label>
            <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} style={numInput} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>MÁXIMO</label>
            <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} style={numInput} />
          </div>
        </div>
      )}

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: "var(--text-muted)" }}>Quantos sortear</label>
          <input type="number" min={1} value={pickCount} onChange={(e) => setPickCount(Number(e.target.value))} style={{ ...numInput, width: 80 }} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} />
          Sem repetição
        </label>
        <button onClick={draw} style={{ marginLeft: "auto", padding: "10px 24px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🎲 Sortear</button>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13 }}>{error}</div>}

      {result.length > 0 && (
        <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {result.length === 1 ? "Resultado" : `${result.length} sorteados`}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {result.map((r, i) => (
              <span key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, padding: "8px 18px", fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
