"use client";

import { useState, useMemo } from "react";
import { markdownToHtml } from "../../lib/markdown";

const SAMPLE = `# Título principal

Um parágrafo com **negrito**, *itálico* e \`código inline\`.

## Lista
- Primeiro item
- Segundo item com [link](https://exemplo.com)

1. Passo um
2. Passo dois

> Uma citação em destaque.

\`\`\`js
const x = 42;
console.log(x);
\`\`\`
`;

const boxStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 320,
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: 14,
  color: "var(--text)",
  fontSize: 13.5,
  fontFamily: "monospace",
  lineHeight: 1.6,
  resize: "vertical",
};

export default function MarkdownTool() {
  const [input, setInput] = useState(SAMPLE);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => markdownToHtml(input), [input]);

  const copy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>MARKDOWN</div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} style={boxStyle} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setView("preview")} style={tabBtn(view === "preview")}>Preview</button>
              <button onClick={() => setView("code")} style={tabBtn(view === "code")}>HTML</button>
            </div>
            <button onClick={copy} style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {copied ? "✓ Copiado" : "Copiar HTML"}
            </button>
          </div>
          {view === "preview" ? (
            <div className="md-preview" style={{ minHeight: 320, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", fontSize: 14, lineHeight: 1.65, color: "var(--text)", overflow: "auto" }} dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <textarea readOnly value={html} spellCheck={false} style={{ ...boxStyle, background: "var(--surface-2)" }} />
          )}
        </div>
      </div>

      <style>{`
        .md-preview h1 { font-size: 24px; font-weight: 700; margin: 8px 0 12px; letter-spacing: -0.02em; }
        .md-preview h2 { font-size: 20px; font-weight: 700; margin: 18px 0 10px; }
        .md-preview h3 { font-size: 17px; font-weight: 600; margin: 16px 0 8px; }
        .md-preview h4, .md-preview h5, .md-preview h6 { font-weight: 600; margin: 14px 0 6px; }
        .md-preview p { margin: 10px 0; }
        .md-preview ul, .md-preview ol { margin: 10px 0; padding-left: 24px; }
        .md-preview li { margin: 4px 0; }
        .md-preview a { color: var(--accent); }
        .md-preview code { background: var(--surface); padding: 2px 6px; border-radius: 5px; font-size: 0.9em; }
        .md-preview pre { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; overflow-x: auto; margin: 12px 0; }
        .md-preview pre code { background: none; padding: 0; }
        .md-preview blockquote { border-left: 3px solid var(--accent); margin: 12px 0; padding: 4px 14px; color: var(--text-muted); }
        .md-preview hr { border: none; border-top: 1px solid var(--border); margin: 18px 0; }
        .md-preview img { max-width: 100%; border-radius: 6px; }
      `}</style>
    </div>
  );
}

function tabBtn(active: boolean): React.CSSProperties {
  return { padding: "5px 12px", borderRadius: 7, border: "1px solid", borderColor: active ? "var(--accent)" : "var(--border)", background: active ? "var(--accent)" : "var(--surface-2)", color: active ? "#fff" : "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" };
}
