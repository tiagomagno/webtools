"use client";

import { useState, useCallback } from "react";
import { generateUuids, type UuidFormat } from "../../lib/uuid";

const MAX = 10000;

export default function UuidBulk() {
  const [count, setCount] = useState(50);
  const [fmt, setFmt] = useState<UuidFormat>({ uppercase: false, hyphens: true, braces: false });
  const [uuids, setUuids] = useState<string[]>(() => generateUuids(50, { hyphens: true }));
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const n = Math.min(MAX, Math.max(1, Math.floor(count)));
    setUuids(generateUuids(n, fmt));
  }, [count, fmt]);

  const text = uuids.join("\n");

  const copyAll = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `uuids-${uuids.length}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const toggle = (key: keyof UuidFormat, label: string) => (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
      <input type="checkbox" checked={!!fmt[key]} onChange={(e) => setFmt({ ...fmt, [key]: e.target.checked })} />
      {label}
    </label>
  );

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label htmlFor="qtd" style={{ fontSize: 13, color: "var(--text-muted)" }}>Quantidade</label>
          <input id="qtd" type="number" min={1} max={MAX} value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: 100, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" }} />
        </div>
        {toggle("uppercase", "Maiúsculas")}
        {toggle("hyphens", "Com hífens")}
        {toggle("braces", "Com chaves {}")}
        <button onClick={generate} style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Gerar</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{uuids.length} UUID{uuids.length > 1 ? "s" : ""}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={download} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Baixar .txt</button>
          <button onClick={copyAll} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar todos"}</button>
        </div>
      </div>

      <textarea readOnly value={text} spellCheck={false} style={{ width: "100%", minHeight: 340, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, color: "var(--text)", fontSize: 13, fontFamily: "monospace", lineHeight: 1.7, resize: "vertical" }} />
    </div>
  );
}
