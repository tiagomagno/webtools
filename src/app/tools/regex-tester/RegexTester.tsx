"use client";

import { useState, useMemo } from "react";

interface Match { index: number; length: number; groups: string[]; }

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const result = useMemo<{ matches: Match[]; highlighted: string } | null>(() => {
    if (!pattern || !text) { setError(""); return null; }
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      setError("");
      const matches: Match[] = [];
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        matches.push({ index: m.index, length: m[0].length, groups: m.slice(1) });
        if (!flags.includes("g")) break;
      }
      let hi = "";
      let last = 0;
      for (const match of matches) {
        hi += text.slice(last, match.index).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
        hi += `<mark style="background:var(--accent)30;color:var(--accent);border-radius:3px;">${text.slice(match.index, match.index + match.length).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</mark>`;
        last = match.index + match.length;
      }
      hi += text.slice(last).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      return { matches, highlighted: hi };
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Regex inválida");
      return null;
    }
  }, [pattern, flags, text]);

  const inputStyle: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14 };
  const FLAG_LIST = ["g", "i", "m", "s"];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginBottom: 12 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 16 }}>/</span>
          <input value={pattern} onChange={e => setPattern(e.target.value)}
            placeholder="padrão regex"
            style={{ ...inputStyle, width: "100%", paddingLeft: 24, paddingRight: 24, fontFamily: "monospace" }} />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 16 }}>/</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {FLAG_LIST.map(f => (
            <button key={f} onClick={() => setFlags(prev => prev.includes(f) ? prev.replace(f,"") : prev + f)}
              title={f === "g" ? "global" : f === "i" ? "case-insensitive" : f === "m" ? "multiline" : "dotAll"}
              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", cursor: "pointer", fontFamily: "monospace", fontSize: 13, background: flags.includes(f) ? "var(--accent)" : "var(--surface)", color: flags.includes(f) ? "#fff" : "var(--text)" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <p style={{ fontSize: 13, color: "#ef4444", marginBottom: 8 }}>⚠ {error}</p>}

      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>TEXTO DE TESTE</label>
      <textarea rows={6} value={text} onChange={e => setText(e.target.value)}
        placeholder="Cole o texto aqui para testar a expressão regular..."
        style={{ ...inputStyle, width: "100%", resize: "vertical", marginBottom: 12, fontFamily: "monospace" }} />

      {result && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {result.matches.length === 0 ? "Nenhuma correspondência encontrada." : `${result.matches.length} correspondência${result.matches.length !== 1 ? "s" : ""} encontrada${result.matches.length !== 1 ? "s" : ""}.`}
            </span>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontFamily: "monospace", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            dangerouslySetInnerHTML={{ __html: result.highlighted }} />

          {result.matches.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>CORRESPONDÊNCIAS</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 180, overflowY: "auto" }}>
                {result.matches.map((m, i) => (
                  <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", fontSize: 13, fontFamily: "monospace", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--accent)" }}>{text.slice(m.index, m.index + m.length)}</span>
                    <span style={{ color: "var(--text-muted)" }}>pos {m.index}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
