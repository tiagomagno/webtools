"use client";

import { useMemo, useState } from "react";
import { parseJson } from "../../lib/json-tools";

function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

export default function JsonValidator() {
  const [input, setInput] = useState("");
  const result = useMemo(() => (input.trim() === "" ? null : parseJson(input)), [input]);

  let summary: { keys: number; type: string } | null = null;
  if (result?.ok) {
    const v = result.value;
    summary = {
      type: typeOf(v),
      keys: typeof v === "object" && v !== null ? (Array.isArray(v) ? v.length : Object.keys(v).length) : 0,
    };
  }

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={14}
        spellCheck={false}
        placeholder='Cole o JSON para validar, ex: {"nome": "João", "idade": 30}'
        aria-label="JSON para validar"
        style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace", marginBottom: 14 }}
      />

      {result === null ? (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", color: "var(--text-muted)", fontSize: 13 }}>
          Cole um JSON acima para validar automaticamente.
        </div>
      ) : result.ok ? (
        <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid #22c55e", borderRadius: 10, padding: "14px 18px", color: "#4ade80", fontSize: 14, fontWeight: 600 }}>
          ✓ JSON válido
          {summary && (
            <span style={{ fontWeight: 400, color: "var(--text-muted)", marginLeft: 10, fontSize: 13 }}>
              tipo: {summary.type}
              {summary.type === "object" && ` · ${summary.keys} chaves`}
              {summary.type === "array" && ` · ${summary.keys} itens`}
            </span>
          )}
        </div>
      ) : (
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", borderRadius: 10, padding: "14px 18px", color: "#f87171", fontSize: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>✗ JSON inválido</div>
          <div style={{ fontFamily: "monospace", fontSize: 13 }}>
            {result.error?.message}
            {result.error?.line && ` — linha ${result.error.line}, coluna ${result.error.column}`}
          </div>
        </div>
      )}
    </div>
  );
}
