"use client";

import { useState } from "react";
import { generateCpf, validateCpf, formatCpf, generateCnpj, validateCnpj, formatCnpj } from "../../lib/cpf-cnpj";

type DocType = "cpf" | "cnpj";
type Mode = "gerar" | "validar";

function GeneratorPanel({ docType }: { docType: DocType }) {
  const [list, setList] = useState<string[]>([]);
  const [qty, setQty] = useState(5);
  const [formatted, setFormatted] = useState(true);
  const [copiedAll, setCopiedAll] = useState(false);

  const isCpf = docType === "cpf";
  const label = isCpf ? "CPF" : "CNPJ";
  const formatOptions = isCpf
    ? [{ v: true, l: "000.000.000-00" }, { v: false, l: "00000000000" }]
    : [{ v: true, l: "00.000.000/0000-00" }, { v: false, l: "00000000000000" }];

  function generate() {
    setList(Array.from({ length: qty }, () => (isCpf ? generateCpf(formatted) : generateCnpj(formatted))));
  }
  function copyAll() {
    navigator.clipboard.writeText(list.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>QUANTIDADE</label>
          <input type="number" min={1} max={100} value={qty} onChange={e => setQty(Math.min(100, Math.max(1, Number(e.target.value))))}
            style={{ width: 80, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", color: "var(--text)", fontSize: 14 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 10 }}>FORMATO</label>
          <div style={{ display: "flex", gap: 8 }}>
            {formatOptions.map(({ v, l }) => (
              <button key={l} onClick={() => setFormatted(v)}
                style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, fontFamily: "monospace", background: formatted === v ? "var(--accent)" : "var(--surface)", color: formatted === v ? "#fff" : "var(--text)" }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <button onClick={generate}
          style={{ marginTop: 16, padding: "10px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Gerar {label}{qty !== 1 ? "s" : ""}
        </button>
      </div>

      {list.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{list.length} {label}{list.length !== 1 ? "S" : ""} GERADO{list.length !== 1 ? "S" : ""}</label>
            <button onClick={copyAll} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>
              {copiedAll ? "✓ Copiados" : "Copiar todos"}
            </button>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            {list.map((doc, i) => (
              <div key={i} style={{ padding: "10px 14px", borderBottom: i < list.length - 1 ? "1px solid var(--border)" : "none", fontFamily: "monospace", fontSize: 15, color: "var(--accent)", display: "flex", justifyContent: "space-between" }}>
                {doc}
                <button onClick={() => navigator.clipboard.writeText(doc)}
                  style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer" }}>
                  copiar
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>⚠ {label}s gerados para fins de teste. Não use para fraudes.</p>
        </>
      )}
    </div>
  );
}

function ValidatorPanel({ docType }: { docType: DocType }) {
  const [input, setInput] = useState("");
  const isCpf = docType === "cpf";
  const label = isCpf ? "CPF" : "CNPJ";
  const formatted = isCpf ? formatCpf(input) : formatCnpj(input);
  const digits = input.replace(/\D/g, "");
  const targetLen = isCpf ? 11 : 14;
  const result = digits.length === targetLen ? (isCpf ? validateCpf(digits) : validateCnpj(digits)) : null;

  const color = result ? (result.valid ? "#22c55e" : "#ef4444") : "var(--text-muted)";

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>{label}</label>
      <input
        value={formatted}
        onChange={e => setInput(e.target.value)}
        placeholder={isCpf ? "000.000.000-00" : "00.000.000/0000-00"}
        maxLength={isCpf ? 14 : 18}
        style={{ width: "100%", background: "var(--surface)", border: `2px solid ${result ? color : "var(--border)"}`, borderRadius: 10, padding: "12px 16px", color: "var(--text)", fontSize: isCpf ? 22 : 20, fontFamily: "monospace", letterSpacing: isCpf ? 2 : 1.5, transition: "border-color .2s" }}
      />

      {result && (
        <div style={{ marginTop: 16, background: result.valid ? "#22c55e15" : "#ef444415", border: `1px solid ${color}`, borderRadius: 10, padding: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 28 }}>{result.valid ? "✓" : "✗"}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>{result.valid ? `${label} Válido` : `${label} Inválido`}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{result.message}</div>
          </div>
        </div>
      )}

      {!input && (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", marginTop: 20 }}>Digite um {label} para validar os dígitos verificadores.</p>
      )}
    </div>
  );
}

export default function CpfCnpjTool() {
  const [docType, setDocType] = useState<DocType>("cpf");
  const [mode, setMode] = useState<Mode>("gerar");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["cpf", "cnpj"] as DocType[]).map((d) => (
          <button key={d} onClick={() => setDocType(d)}
            style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: "1px solid var(--border)", cursor: "pointer", fontSize: 14, fontWeight: 700, background: docType === d ? "var(--accent)" : "var(--surface)", color: docType === d ? "#fff" : "var(--text)" }}>
            {d.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid var(--border)" }}>
        {(["gerar", "validar"] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{
            fontSize: 13, fontWeight: 500, padding: "9px 18px",
            background: "transparent", border: "none",
            borderBottom: `2px solid ${mode === m ? "var(--accent)" : "transparent"}`,
            color: mode === m ? "var(--text)" : "var(--text-muted)",
            cursor: "pointer", transition: "all 0.15s", marginBottom: -1,
          }}>
            {m === "gerar" ? "🎲 Gerar" : "✅ Validar"}
          </button>
        ))}
      </div>

      {mode === "gerar" ? <GeneratorPanel key={docType} docType={docType} /> : <ValidatorPanel key={docType} docType={docType} />}
    </div>
  );
}
