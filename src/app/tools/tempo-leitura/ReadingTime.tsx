"use client";

import { useMemo, useState } from "react";
import { computeStats, formatReadingTime } from "../../lib/text-stats";

const SPEAKING_WPM = 130; // velocidade média de fala

export default function ReadingTime() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(200);

  const stats = useMemo(() => computeStats(text, wpm), [text, wpm]);
  const speakingSeconds = useMemo(() => (stats.words / SPEAKING_WPM) * 60, [stats.words]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "var(--accent)18", border: "1px solid var(--accent)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "monospace", color: "var(--accent)" }}>
            {formatReadingTime(stats.readingSeconds)}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Tempo de leitura</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace", color: "var(--text)" }}>
            {formatReadingTime(speakingSeconds)}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Tempo de fala (~{SPEAKING_WPM} ppm)</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace", color: "var(--text)" }}>
            {stats.words.toLocaleString("pt-BR")}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Palavras</div>
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <label htmlFor="rt-input" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Texto para estimar tempo de leitura
        </label>
        <textarea
          id="rt-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole seu artigo, post ou roteiro para estimar o tempo de leitura e de fala..."
          rows={10}
          spellCheck={false}
          style={{
            width: "100%",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "14px 16px",
            color: "var(--text)",
            fontSize: 15,
            lineHeight: 1.6,
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => setText("")}
            disabled={text === ""}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface-2)",
              color: text === "" ? "var(--text-subtle)" : "var(--text-muted)",
              fontSize: 13,
              fontWeight: 600,
              cursor: text === "" ? "default" : "pointer",
            }}
          >
            Limpar
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <label htmlFor="rt-wpm" style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
              Velocidade de leitura
            </label>
            <input id="rt-wpm" type="range" min={100} max={400} step={10} value={wpm} onChange={(e) => setWpm(Number(e.target.value))} style={{ width: 120 }} />
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text)", minWidth: 64 }}>{wpm} ppm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
