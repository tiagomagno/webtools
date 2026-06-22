"use client";

import { useState } from "react";

type Mode = "encode" | "decode";

export default function UrlEncoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [component, setComponent] = useState(true);
  const [copied, setCopied] = useState(false);

  let output = "";
  let error = "";
  try {
    if (input) {
      if (mode === "encode") output = component ? encodeURIComponent(input) : encodeURI(input);
      else output = component ? decodeURIComponent(input) : decodeURI(input);
    }
  } catch {
    error = "Sequência de escape inválida na decodificação.";
  }

  const copy = () => { if (output) { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1400); } };

  const boxStyle: React.CSSProperties = { width: "100%", minHeight: 150, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, color: "var(--text)", fontSize: 14, fontFamily: "monospace", lineHeight: 1.6, resize: "vertical", wordBreak: "break-all" };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setMode("encode")} style={seg(mode === "encode")}>Codificar</button>
        <button onClick={() => setMode("decode")} style={seg(mode === "decode")}>Decodificar</button>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer", marginLeft: 8 }}>
          <input type="checkbox" checked={component} onChange={(e) => setComponent(e.target.checked)} />
          Componente (encodeURIComponent)
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>ENTRADA</div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder={mode === "encode" ? "https://exemplo.com/busca?q=café com leite" : "https%3A%2F%2Fexemplo.com"} style={boxStyle} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>RESULTADO</span>
            <button onClick={copy} disabled={!output} style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: output ? "pointer" : "not-allowed", opacity: output ? 1 : 0.5 }}>{copied ? "✓" : "Copiar"}</button>
          </div>
          <textarea readOnly value={error ? "" : output} spellCheck={false} style={{ ...boxStyle, background: "var(--surface-2)" }} />
        </div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 12 }}>⚠ {error}</div>}
    </div>
  );
}

function seg(active: boolean): React.CSSProperties {
  return { padding: "8px 18px", borderRadius: 8, border: "1px solid", borderColor: active ? "var(--accent)" : "var(--border)", background: active ? "var(--accent)" : "var(--surface-2)", color: active ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" };
}
