"use client";

import { useMemo, useState } from "react";
import { diffLines } from "../../lib/line-diff";

export default function TextCompare() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const result = useMemo(() => diffLines(a, b), [a, b]);
  const hasInput = a !== "" || b !== "";

  const boxStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "var(--text)",
    fontSize: 13,
    lineHeight: 1.6,
    resize: "vertical",
    fontFamily: "monospace",
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div>
          <label htmlFor="tc-a" style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
            Texto original
          </label>
          <textarea id="tc-a" value={a} onChange={(e) => setA(e.target.value)} rows={10} spellCheck={false} placeholder="Cole o texto original..." style={boxStyle} />
        </div>
        <div>
          <label htmlFor="tc-b" style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
            Texto modificado
          </label>
          <textarea id="tc-b" value={b} onChange={(e) => setB(e.target.value)} rows={10} spellCheck={false} placeholder="Cole o texto modificado..." style={boxStyle} />
        </div>
      </div>

      {hasInput && (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 600 }}>+ {result.added} adicionadas</span>
            <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 600 }}>− {result.removed} removidas</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>= {result.unchanged} iguais</span>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", fontFamily: "monospace", fontSize: 13 }}>
            {result.lines.map((line, idx) => {
              const bg = line.op === "added" ? "rgba(34,197,94,0.12)" : line.op === "removed" ? "rgba(239,68,68,0.12)" : "transparent";
              const mark = line.op === "added" ? "+" : line.op === "removed" ? "−" : " ";
              const color = line.op === "added" ? "#4ade80" : line.op === "removed" ? "#f87171" : "var(--text-muted)";
              return (
                <div key={idx} style={{ display: "flex", background: bg, padding: "2px 12px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  <span style={{ width: 16, color, flexShrink: 0, userSelect: "none" }}>{mark}</span>
                  <span style={{ color: line.op === "equal" ? "var(--text)" : color }}>{line.text || " "}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
