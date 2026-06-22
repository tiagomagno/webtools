"use client";

import { useState, useMemo } from "react";
import { slugify } from "../../lib/slugify";

export default function SlugTool() {
  const [input, setInput] = useState("Como Criar um Blog em 2026: Guia Completo!");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [strict, setStrict] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(
    () => slugify(input, { separator, lowercase, strict }),
    [input, separator, lowercase, strict],
  );

  const copy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>TEXTO</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          style={{ width: "100%", minHeight: 90, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, color: "var(--text)", fontSize: 15, lineHeight: 1.6, resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, marginBottom: 16, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
          Separador
          <select value={separator} onChange={(e) => setSeparator(e.target.value)} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", color: "var(--text)", fontSize: 13 }}>
            <option value="-">Hífen ( - )</option>
            <option value="_">Sublinhado ( _ )</option>
            <option value=".">Ponto ( . )</option>
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
          Minúsculas
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={strict} onChange={(e) => setStrict(e.target.checked)} />
          Apenas a–z e 0–9 (remove acentos)
        </label>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Slug</div>
          <button onClick={copy} disabled={!slug} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: slug ? "var(--accent)" : "var(--surface-2)", color: slug ? "#fff" : "var(--text-subtle)", fontSize: 13, fontWeight: 700, cursor: slug ? "pointer" : "not-allowed" }}>
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, fontSize: 15, fontFamily: "monospace", color: slug ? "var(--text)" : "var(--text-subtle)", wordBreak: "break-all", minHeight: 20 }}>
          {slug || "o-slug-aparece-aqui"}
        </div>
        {slug && <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 8 }}>{slug.length} caracteres</p>}
      </div>
    </div>
  );
}
