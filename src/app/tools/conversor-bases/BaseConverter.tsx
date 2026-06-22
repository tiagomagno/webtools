"use client";

import { useState, useMemo } from "react";

function convert(value: string, from: number): { bin: string; oct: string; dec: string; hex: string } | null {
  if (!value.trim()) return null;
  try {
    const dec = parseInt(value.replace(/\s/g, ""), from);
    if (isNaN(dec) || dec < 0) return null;
    return { bin: dec.toString(2), oct: dec.toString(8), dec: dec.toString(10), hex: dec.toString(16).toUpperCase() };
  } catch { return null; }
}

const BASES = [
  { base: 10, label: "Decimal (10)", prefix: "", placeholder: "255" },
  { base: 2,  label: "Binário (2)",  prefix: "0b", placeholder: "11111111" },
  { base: 8,  label: "Octal (8)",    prefix: "0o", placeholder: "377" },
  { base: 16, label: "Hexadecimal (16)", prefix: "0x", placeholder: "FF" },
];

export default function BaseConverter() {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState(10);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const result = useMemo(() => convert(input, from), [input, from]);

  function copy(key: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1200);
  }

  const outputs: { key: keyof typeof result; label: string; prefix: string }[] = [
    { key: "dec", label: "Decimal", prefix: "" },
    { key: "bin", label: "Binário", prefix: "0b" },
    { key: "oct", label: "Octal", prefix: "0o" },
    { key: "hex", label: "Hexadecimal", prefix: "0x" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {BASES.map(b => (
          <button key={b.base} onClick={() => { setFrom(b.base); setInput(""); }}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, background: from === b.base ? "var(--accent)" : "var(--surface)", color: from === b.base ? "#fff" : "var(--text)" }}>
            {b.label}
          </button>
        ))}
      </div>

      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>
        VALOR EM {BASES.find(b => b.base === from)?.label.toUpperCase()}
      </label>
      <input value={input} onChange={e => setInput(e.target.value.toUpperCase())}
        placeholder={BASES.find(b => b.base === from)?.placeholder}
        style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontSize: 18, fontFamily: "monospace", marginBottom: 20 }} />

      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {outputs.map(({ key, label, prefix }) => {
            if (!result) return null;
            const val = result[key as keyof typeof result];
            const display = prefix + val;
            return (
              <div key={key} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>{label.toUpperCase()}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)", fontFamily: "monospace", wordBreak: "break-all", marginBottom: 8 }}>{display}</div>
                <button onClick={() => copy(key, display)}
                  style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>
                  {copiedKey === key ? "✓ Copiado" : "Copiar"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {input && !result && (
        <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center" }}>Valor inválido para a base selecionada.</p>
      )}
    </div>
  );
}
