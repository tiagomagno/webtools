"use client";

import { useState } from "react";
import { parseJson } from "../../lib/json-tools";

type Indent = "2" | "4" | "tab" | "min";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<Indent>("2");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const format = () => {
    const res = parseJson(input);
    if (!res.ok) {
      setError(res.error?.line ? `${res.error.message} (linha ${res.error.line}, coluna ${res.error.column})` : res.error?.message ?? "JSON inválido");
      setOutput("");
      return;
    }
    setError(null);
    const space = indent === "min" ? undefined : indent === "tab" ? "\t" : Number(indent);
    setOutput(JSON.stringify(res.value, null, space));
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const INDENTS: { k: Indent; label: string }[] = [
    { k: "2", label: "2 espaços" },
    { k: "4", label: "4 espaços" },
    { k: "tab", label: "Tab" },
    { k: "min", label: "Minificar" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
        {INDENTS.map((o) => (
          <button
            key={o.k}
            onClick={() => setIndent(o.k)}
            style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid", borderColor: indent === o.k ? "var(--accent)" : "var(--border)", background: indent === o.k ? "var(--accent)" : "var(--surface-2)", color: indent === o.k ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {o.label}
          </button>
        ))}
        <button onClick={format} style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Formatar
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13, marginBottom: 12, fontFamily: "monospace" }}>
          ⚠ {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={16}
          spellCheck={false}
          placeholder='{"exemplo": "cole seu JSON aqui"}'
          aria-label="JSON de entrada"
          style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace" }}
        />
        <div>
          <textarea
            value={output}
            readOnly
            rows={16}
            aria-label="JSON formatado"
            placeholder="Resultado formatado..."
            style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace" }}
          />
          <button onClick={copy} disabled={output === ""} style={{ marginTop: 10, padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: output === "" ? "var(--surface-2)" : "var(--accent)", color: output === "" ? "var(--text-subtle)" : "#fff", fontSize: 13, fontWeight: 600, cursor: output === "" ? "default" : "pointer" }}>
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}
