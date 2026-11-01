"use client";

import { useMemo, useState } from "react";
import { computeStats, formatReadingTime, DEFAULT_WPM } from "../../lib/text-stats";

const SAMPLE =
  "Cole ou digite seu texto aqui. As estatísticas são calculadas em tempo real, direto no seu navegador — nada é enviado para servidores.";

const LIMITS = [
  { label: "Título SEO", max: 60 },
  { label: "Meta description", max: 160 },
  { label: "Tweet / X", max: 280 },
  { label: "SMS", max: 160 },
  { label: "Bio Instagram", max: 150 },
];

const SPEAKING_WPM = 130;

interface StatCard {
  key: string;
  label: string;
  value: string;
  primary?: boolean;
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(DEFAULT_WPM);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => computeStats(text, wpm), [text, wpm]);
  const speakingSeconds = useMemo(() => (stats.words / SPEAKING_WPM) * 60, [stats.words]);

  const cards: StatCard[] = [
    { key: "words", label: "Palavras", value: stats.words.toLocaleString("pt-BR"), primary: true },
    { key: "charsWith", label: "Caracteres", value: stats.charactersWithSpaces.toLocaleString("pt-BR") },
    { key: "charsNo", label: "Sem espaços", value: stats.charactersNoSpaces.toLocaleString("pt-BR") },
    { key: "sentences", label: "Frases", value: stats.sentences.toLocaleString("pt-BR") },
    { key: "paragraphs", label: "Parágrafos", value: stats.paragraphs.toLocaleString("pt-BR") },
    { key: "lines", label: "Linhas", value: stats.lines.toLocaleString("pt-BR") },
    { key: "reading", label: "Leitura", value: formatReadingTime(stats.readingSeconds) },
    { key: "speaking", label: `Fala (~${SPEAKING_WPM} ppm)`, value: formatReadingTime(speakingSeconds) },
  ];

  const copyReport = () => {
    const report = cards.map((c) => `${c.label}: ${c.value}`).join("\n");
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {cards.map((c) => (
          <div
            key={c.key}
            style={{
              background: c.primary ? "var(--accent)18" : "var(--surface)",
              border: `1px solid ${c.primary ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 12,
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: c.primary ? 28 : 20,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                fontFamily: "monospace",
                color: c.primary ? "var(--accent)" : "var(--text)",
                lineHeight: 1.2,
              }}
            >
              {c.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Textarea */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <label htmlFor="wc-input" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Texto para análise
        </label>
        <textarea
          id="wc-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={SAMPLE}
          rows={12}
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
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
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
          <button
            onClick={copyReport}
            disabled={text === ""}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: text === "" ? "var(--surface-2)" : "var(--accent)",
              color: text === "" ? "var(--text-subtle)" : "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: text === "" ? "default" : "pointer",
            }}
          >
            {copied ? "✓ Copiado" : "Copiar estatísticas"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <label htmlFor="wc-wpm" style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
              Velocidade de leitura
            </label>
            <input
              id="wc-wpm"
              type="range"
              min={100}
              max={400}
              step={10}
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              style={{ width: 110 }}
            />
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text)", minWidth: 64 }}>
              {wpm} ppm
            </span>
          </div>
        </div>
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
