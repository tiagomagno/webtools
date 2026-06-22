"use client";

import { useState } from "react";
import {
  toUpperCase, toLowerCase, toTitleCase, toSentenceCase,
  toCamelCase, toPascalCase, toSnakeCase, toKebabCase, toAlternatingCase,
} from "../../lib/text-transform";

const MODES = [
  { key: "upper",      label: "MAIÚSCULAS" },
  { key: "lower",      label: "minúsculas" },
  { key: "title",      label: "Título" },
  { key: "sentence",   label: "Frase" },
  { key: "camel",      label: "camelCase" },
  { key: "pascal",     label: "PascalCase" },
  { key: "snake",      label: "snake_case" },
  { key: "kebab",      label: "kebab-case" },
  { key: "alternating",label: "aLtErNaDo" },
] as const;

type Mode = typeof MODES[number]["key"];

const transform: Record<Mode, (s: string) => string> = {
  upper: toUpperCase, lower: toLowerCase, title: toTitleCase,
  sentence: toSentenceCase, camel: toCamelCase, pascal: toPascalCase,
  snake: toSnakeCase, kebab: toKebabCase, alternating: toAlternatingCase,
};

export default function TextFormatter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("upper");
  const [copied, setCopied] = useState(false);

  const output = input ? transform[mode](input) : "";

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const base: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 14, width: "100%", resize: "vertical" };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {MODES.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, fontFamily: "monospace", background: mode === m.key ? "var(--accent)" : "var(--surface)", color: mode === m.key ? "#fff" : "var(--text)" }}>
            {m.label}
          </button>
        ))}
      </div>

      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>TEXTO DE ENTRADA</label>
      <textarea rows={5} value={input} onChange={e => setInput(e.target.value)}
        placeholder="Cole ou escreva o texto aqui..." style={{ ...base, marginBottom: 16 }} />

      {output && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>RESULTADO</label>
            <button onClick={copy} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>
              {copied ? "✓ Copiado" : "Copiar"}
            </button>
          </div>
          <textarea rows={5} readOnly value={output} style={{ ...base, color: "var(--accent)" }} />
        </>
      )}
    </div>
  );
}
