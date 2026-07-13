"use client";

import { useState } from "react";
import WordCounter from "../contador-palavras/WordCounter";
import TextCompare from "../comparador-textos/TextCompare";
import TextCleaner from "../text-cleaner/TextCleaner";
import TextFormatter from "../formatador-texto/TextFormatter";
import TextInverter from "../inversor-texto/TextInverter";
import AccentRemover from "../removedor-acentos/AccentRemover";
import LineSorter from "../ordenador-linhas/LineSorter";
import LineCounter from "../contador-linhas/LineCounter";
import SlugTool from "../texto-para-slug/SlugTool";
import LoremGenerator from "../lorem-ipsum/LoremGenerator";
import NumberToWords from "../numero-por-extenso/NumberToWords";
import CaesarCipher from "../cifra-cesar/CaesarCipher";
import MorseTool from "../texto-para-morse/MorseTool";
import LetterFrequency from "../contador-vogais/LetterFrequency";

const TABS = [
  // Análise
  { id: "analisador",  label: "Analisador",     emoji: "📊", group: "Análise",    desc: "Palavras, caracteres, frases, limites de redes e tempo de leitura." },
  { id: "frequencia",  label: "Frequência",      emoji: "🔤", group: "Análise",    desc: "Distribuição de vogais, consoantes e frequência de cada letra." },
  { id: "linhas",      label: "Contador de Linhas", emoji: "📋", group: "Análise", desc: "Total, não-vazias, vazias e linhas únicas." },
  { id: "comparador",  label: "Comparador",      emoji: "🔀", group: "Análise",    desc: "Compare dois textos e veja diferenças linha a linha." },
  // Transformar
  { id: "formatar",    label: "Formatador",      emoji: "✏️", group: "Transformar", desc: "MAIÚSCULAS, minúsculas, camelCase, snake_case e mais." },
  { id: "inversor",    label: "Inversor",        emoji: "🔄", group: "Transformar", desc: "Inverta por caracteres, palavras ou linhas." },
  { id: "acentos",     label: "Acentos",         emoji: "🧹", group: "Transformar", desc: "Remova ã, é, ç, õ e todos os diacríticos." },
  { id: "ordenar",     label: "Ordenar Linhas",  emoji: "↕️", group: "Transformar", desc: "A→Z, Z→A, por comprimento, aleatório ou remove duplicatas." },
  { id: "limpeza",     label: "Limpeza",         emoji: "✂️", group: "Transformar", desc: "Substituições, regex e remoção de linhas em tempo real." },
  // Gerar
  { id: "slug",        label: "Slug",            emoji: "🔗", group: "Gerar",      desc: "Gere slugs amigáveis para URL." },
  { id: "lorem",       label: "Lorem Ipsum",     emoji: "📄", group: "Gerar",      desc: "Texto de preenchimento em parágrafos, frases ou palavras." },
  { id: "extenso",     label: "Nº por Extenso",  emoji: "🔢", group: "Gerar",      desc: "Converta números para extenso em português." },
  // Codificar
  { id: "cifra",       label: "Cifra de César",  emoji: "🔐", group: "Codificar",  desc: "ROT13 e deslocamentos personalizados." },
  { id: "morse",       label: "Morse",           emoji: "📡", group: "Codificar",  desc: "Texto ↔ Código Morse instantâneo." },
] as const;

type TabId = typeof TABS[number]["id"];

const GROUPS = ["Análise", "Transformar", "Gerar", "Codificar"] as const;

const GROUP_COLORS: Record<string, string> = {
  "Análise":    "#6366f1",
  "Transformar":"#22c55e",
  "Gerar":      "#0ea5e9",
  "Codificar":  "#f59e0b",
};

export default function TextToolsHub() {
  const [active, setActive] = useState<TabId>("analisador");

  const current = TABS.find((t) => t.id === active)!;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🔡 Ferramentas de Texto
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
          14 ferramentas de texto reunidas em um único lugar — análise, transformação, geração e codificação.
        </p>
      </div>

      {/* Tab nav por grupo */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 20, overflow: "hidden" }}>
        {GROUPS.map((group) => {
          const tabs = TABS.filter((t) => t.group === group);
          const color = GROUP_COLORS[group];
          const hasActive = tabs.some((t) => t.id === active);
          return (
            <div key={group} style={{ borderBottom: group !== "Codificar" ? "1px solid var(--border)" : "none" }}>
              {/* Label do grupo */}
              <div style={{
                padding: "6px 16px",
                fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em",
                color: hasActive ? color : "var(--text-muted)",
                background: hasActive ? color + "0d" : "transparent",
                borderLeft: `3px solid ${hasActive ? color : "transparent"}`,
                transition: "all 0.15s",
              }}>
                {group}
              </div>
              {/* Abas do grupo */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 0, padding: "4px 8px 6px" }}>
                {tabs.map((tab) => {
                  const isActive = tab.id === active;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActive(tab.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        cursor: "pointer", transition: "all 0.15s", margin: "2px",
                        background: isActive ? color + "22" : "transparent",
                        border: `1px solid ${isActive ? color + "66" : "transparent"}`,
                        color: isActive ? color : "var(--text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{tab.emoji}</span>
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cabeçalho da aba ativa */}
      <div style={{
        padding: "12px 16px", borderRadius: 10, marginBottom: 16,
        background: GROUP_COLORS[current.group] + "0d",
        border: `1px solid ${GROUP_COLORS[current.group]}33`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>{current.emoji}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: GROUP_COLORS[current.group] }}>{current.label}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{current.desc}</div>
        </div>
      </div>

      {/* Conteúdo */}
      <div>
        {active === "analisador"  && <WordCounter />}
        {active === "frequencia"  && <LetterFrequency />}
        {active === "linhas"      && <LineCounter />}
        {active === "comparador"  && <TextCompare />}
        {active === "formatar"    && <TextFormatter />}
        {active === "inversor"    && <TextInverter />}
        {active === "acentos"     && <AccentRemover />}
        {active === "ordenar"     && <LineSorter />}
        {active === "limpeza"     && <TextCleaner />}
        {active === "slug"        && <SlugTool />}
        {active === "lorem"       && <LoremGenerator />}
        {active === "extenso"     && <NumberToWords />}
        {active === "cifra"       && <CaesarCipher />}
        {active === "morse"       && <MorseTool />}
      </div>
    </div>
  );
}
