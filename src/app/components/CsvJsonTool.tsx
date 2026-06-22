"use client";

import { useState, useMemo } from "react";
import { csvToJson, jsonToCsv } from "../lib/csv-json";

type Mode = "csv2json" | "json2csv";

const SAMPLE_CSV = `nome,idade,ativo
Ana,29,true
Bruno,34,false`;

const SAMPLE_JSON = `[
  { "nome": "Ana", "idade": 29, "ativo": true },
  { "nome": "Bruno", "idade": 34, "ativo": false }
]`;

const boxStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 220,
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

export default function CsvJsonTool({ mode }: { mode: Mode }) {
  const [input, setInput] = useState(mode === "csv2json" ? SAMPLE_CSV : SAMPLE_JSON);
  const [delimiter, setDelimiter] = useState(",");
  const [header, setHeader] = useState(true);
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    try {
      if (!input.trim()) return { output: "", error: "" };
      if (mode === "csv2json") {
        const json = csvToJson(input, { delimiter, header });
        return { output: JSON.stringify(json, null, indent), error: "" };
      } else {
        const parsed = JSON.parse(input);
        return { output: jsonToCsv(parsed, { delimiter }), error: "" };
      }
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Erro na conversão." };
    }
  }, [input, mode, delimiter, header, indent]);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const download = () => {
    if (!output) return;
    const isJson = mode === "csv2json";
    const blob = new Blob([output], { type: isJson ? "application/json" : "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = isJson ? "dados.json" : "dados.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
          Delimitador
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", color: "var(--text)", fontSize: 13 }}>
            <option value=",">Vírgula ( , )</option>
            <option value=";">Ponto e vírgula ( ; )</option>
            <option value={"\t"}>Tabulação</option>
            <option value="|">Pipe ( | )</option>
          </select>
        </label>
        {mode === "csv2json" && (
          <>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
              <input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} />
              Primeira linha é cabeçalho
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
              Indentação
              <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", color: "var(--text)", fontSize: 13 }}>
                <option value={2}>2 espaços</option>
                <option value={4}>4 espaços</option>
                <option value={0}>Minificado</option>
              </select>
            </label>
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>{mode === "csv2json" ? "CSV" : "JSON"}</div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} style={boxStyle} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{mode === "csv2json" ? "JSON" : "CSV"}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={copy} disabled={!output} style={miniBtn(!output)}>{copied ? "✓" : "Copiar"}</button>
              <button onClick={download} disabled={!output} style={miniBtn(!output)}>Baixar</button>
            </div>
          </div>
          <textarea readOnly value={error ? "" : output} spellCheck={false} style={{ ...boxStyle, background: "var(--surface-2)" }} placeholder={error ? "" : "Resultado..."} />
        </div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 12 }}>⚠ {error}</div>}
    </div>
  );
}

function miniBtn(disabled: boolean): React.CSSProperties {
  return { padding: "5px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 };
}
