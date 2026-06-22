"use client";

import { useState, useCallback, useEffect } from "react";
import { generateLorem, type LoremUnit } from "../../lib/lorem";

const UNITS: { id: LoremUnit; label: string }[] = [
  { id: "paragraphs", label: "Parágrafos" },
  { id: "sentences", label: "Frases" },
  { id: "words", label: "Palavras" },
];

export default function LoremGenerator() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [classic, setClassic] = useState(true);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setText(generateLorem(count, unit, classic));
  }, [count, unit, classic]);

  useEffect(() => { generate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); };

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: "var(--text-muted)" }}>Quantidade</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: 80, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {UNITS.map((u) => (
            <button key={u.id} onClick={() => setUnit(u.id)} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid", borderColor: unit === u.id ? "var(--accent)" : "var(--border)", background: unit === u.id ? "var(--accent)" : "var(--surface-2)", color: unit === u.id ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {u.label}
            </button>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} />
          Iniciar com &quot;Lorem ipsum...&quot;
        </label>
        <button onClick={generate} style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Gerar</button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <button onClick={copy} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18, fontSize: 15, lineHeight: 1.7, color: "var(--text)", whiteSpace: "pre-wrap", minHeight: 200 }}>{text}</div>
    </div>
  );
}
