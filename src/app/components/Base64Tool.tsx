"use client";

import { useMemo, useState } from "react";
import { encodeBase64, decodeBase64 } from "../lib/base64";

export default function Base64Tool({ mode }: { mode: "encode" | "decode" }) {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (input === "") return { output: "", error: null as string | null };
    try {
      return { output: mode === "encode" ? encodeBase64(input) : decodeBase64(input), error: null };
    } catch {
      return { output: "", error: mode === "decode" ? "Base64 inválido — verifique o conteúdo colado." : "Erro ao codificar." };
    }
  }, [input, mode]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
      <div>
        <label htmlFor="b64-in" style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
          {mode === "encode" ? "Texto" : "Base64"}
        </label>
        <textarea
          id="b64-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={12}
          spellCheck={false}
          placeholder={mode === "encode" ? "Digite o texto para codificar..." : "Cole o Base64 para decodificar..."}
          style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace" }}
        />
      </div>
      <div>
        <label htmlFor="b64-out" style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
          {mode === "encode" ? "Base64" : "Texto"}
        </label>
        <textarea
          id="b64-out"
          value={error ? "" : output}
          readOnly
          rows={12}
          placeholder="Resultado..."
          style={{ width: "100%", background: "var(--surface)", border: `1px solid ${error ? "#ef4444" : "var(--border)"}`, borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace" }}
        />
        {error && <div style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>⚠ {error}</div>}
        <button onClick={copy} disabled={output === ""} style={{ marginTop: 10, padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: output === "" ? "var(--surface-2)" : "var(--accent)", color: output === "" ? "var(--text-subtle)" : "#fff", fontSize: 13, fontWeight: 600, cursor: output === "" ? "default" : "pointer" }}>
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>
    </div>
  );
}
