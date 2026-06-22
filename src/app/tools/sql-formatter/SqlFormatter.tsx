"use client";

import { useState } from "react";
import { formatSql } from "../../lib/sql-format";

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = () => setOutput(formatSql(input));

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <button onClick={run} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
        Formatar SQL
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={14}
          spellCheck={false}
          placeholder="select id, nome from usuarios where ativo = 1 order by nome"
          aria-label="SQL de entrada"
          style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace" }}
        />
        <div>
          <textarea
            value={output}
            readOnly
            rows={14}
            aria-label="SQL formatado"
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
