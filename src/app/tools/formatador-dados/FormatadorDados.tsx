"use client";

import { useState } from "react";
import { BracketsCurly, Code, FileCsv, FileHtml } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import CsvJsonTool from "../../components/CsvJsonTool";
import JsonTools from "./JsonTools";
import CodeFormatterTools from "./CodeFormatterTools";
import MarkdownTool from "./MarkdownTool";

const DIRECTIONS = [
  { id: "csv2json", label: "CSV → JSON" },
  { id: "json2csv", label: "JSON → CSV" },
] as const;

function CsvJson() {
  const [mode, setMode] = useState<"csv2json" | "json2csv">("csv2json");
  return (
    <div>
      <div role="group" aria-label="Direção da conversão" style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {DIRECTIONS.map(({ id, label }) => {
          const active = id === mode;
          return (
            <button key={id} type="button" aria-pressed={active} onClick={() => setMode(id)}
              style={{ minHeight: 36, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`, background: active ? "var(--accent-strong)" : "var(--surface)", color: active ? "#fff" : "var(--text)" }}>
              {label}
            </button>
          );
        })}
      </div>
      <CsvJsonTool key={mode} mode={mode} />
    </div>
  );
}

export default function FormatadorDados() {
  return (
    <ToolTabs
      label="Tipo de dado ou código"
      tabs={[
        { id: "json", label: "JSON", icon: BracketsCurly, content: <JsonTools /> },
        { id: "codigo", label: "SQL, HTML, CSS e XML", icon: Code, content: <CodeFormatterTools /> },
        { id: "csv", label: "CSV ↔ JSON", icon: FileCsv, content: <CsvJson /> },
        { id: "markdown", label: "Markdown → HTML", icon: FileHtml, content: <MarkdownTool /> },
      ]}
    />
  );
}
