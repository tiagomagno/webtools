"use client";

import { useMemo, useState } from "react";
import { computeStats } from "../../lib/text-stats";

const LIMITS = [
  { label: "Título SEO", max: 60 },
  { label: "Meta description", max: 160 },
  { label: "Tweet / X", max: 280 },
  { label: "SMS", max: 160 },
  { label: "Bio Instagram", max: 150 },
];

export default function CharCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => computeStats(text), [text]);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Caracteres", value: stats.charactersWithSpaces, primary: true },
          { label: "Sem espaços", value: stats.charactersNoSpaces },
          { label: "Palavras", value: stats.words },
          { label: "Linhas", value: stats.lines },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: c.primary ? "var(--accent)18" : "var(--surface)",
              border: `1px solid ${c.primary ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: c.primary ? 30 : 24,
                fontWeight: 700,
                fontFamily: "monospace",
                color: c.primary ? "var(--accent)" : "var(--text)",
              }}
            >
              {c.value.toLocaleString("pt-BR")}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <label htmlFor="cc-input" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Texto para contar caracteres
        </label>
        <textarea
          id="cc-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite ou cole seu texto para contar os caracteres..."
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
        <button
          onClick={() => setText("")}
          disabled={text === ""}
          style={{
            marginTop: 12,
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
      </div>

      {/* Limites comuns */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
          Limites comuns
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LIMITS.map((l) => {
            const used = stats.charactersWithSpaces;
            const pct = Math.min(100, (used / l.max) * 100);
            const over = used > l.max;
            return (
              <div key={l.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "var(--text-muted)" }}>{l.label}</span>
                  <span style={{ fontFamily: "monospace", color: over ? "#ef4444" : "var(--text)" }}>
                    {used}/{l.max}
                  </span>
                </div>
                <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: over ? "#ef4444" : "var(--accent)", transition: "width 0.1s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
