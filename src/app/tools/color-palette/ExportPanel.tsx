"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { buildExport, type ExportFormat } from "../../lib/palette";

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: "css", label: "Variáveis CSS" },
  { id: "tailwind", label: "Tailwind" },
  { id: "json", label: "JSON" },
];

/** Exporta as cores da paleta como código. */
export default function ExportPanel({ colors }: { colors: string[] }) {
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);
  const code = buildExport(format, colors);

  const copy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div role="group" aria-label="Formato de exportação" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {FORMATS.map((f) => {
          const active = f.id === format;
          return (
            <button key={f.id} type="button" aria-pressed={active} onClick={() => setFormat(f.id)}
              style={{ padding: "8px 12px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`, background: active ? "var(--accent-strong)" : "var(--surface)", color: active ? "#fff" : "var(--text)" }}>
              {f.label}
            </button>
          );
        })}
      </div>
      <pre style={{ margin: 0, padding: 16, fontSize: 12, lineHeight: 1.7, fontFamily: "var(--font-kode), ui-monospace, monospace", color: "var(--text)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "auto", maxHeight: 280, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {code}
      </pre>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="button" onClick={copy}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", borderRadius: 8, background: "var(--accent-strong)", color: "#fff" }}>
          {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar código"}
        </button>
      </div>
    </div>
  );
}
