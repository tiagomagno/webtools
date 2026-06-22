"use client";

import { useState, useCallback } from "react";
import { generateUuid } from "../../lib/uuid";

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [upper, setUpper] = useState(false);
  const [uuids, setUuids] = useState<string[]>([generateUuid()]);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = useCallback(() => {
    const n = Math.min(1000, Math.max(1, count));
    setUuids(Array.from({ length: n }, generateUuid));
  }, [count]);

  const display = (u: string) => (upper ? u.toUpperCase() : u);

  const copyOne = (u: string) => {
    navigator.clipboard.writeText(display(u));
    setCopied(u);
    setTimeout(() => setCopied(null), 1200);
  };
  const copyAll = () => {
    navigator.clipboard.writeText(uuids.map(display).join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label htmlFor="uuid-count" style={{ fontSize: 13, color: "var(--text-muted)" }}>Quantidade</label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            style={{ width: 90, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" }}
          />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
          Maiúsculas
        </label>
        <button onClick={generate} style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Gerar
        </button>
        <button onClick={copyAll} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {copied === "all" ? "✓ Copiado" : "Copiar todos"}
        </button>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        {uuids.map((u, i) => (
          <div
            key={u + i}
            onClick={() => copyOne(u)}
            className="uuid-row"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: i < uuids.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", fontFamily: "monospace", fontSize: 14 }}
          >
            <span style={{ color: "var(--text)" }}>{display(u)}</span>
            <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{copied === u ? "✓ copiado" : "copiar"}</span>
          </div>
        ))}
      </div>

      <style>{`.uuid-row:hover { background: var(--surface-2); }`}</style>
    </div>
  );
}
