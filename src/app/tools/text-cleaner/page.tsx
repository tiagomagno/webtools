"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Rule {
  id: number;
  find: string;
  replace: string;
  enabled: boolean;
  isRegex: boolean;
}

interface Preset {
  label: string;
  rules: Omit<Rule, "id" | "enabled">[];
}

const PRESETS: Preset[] = [
  {
    label: "Limpar espaços extras",
    rules: [{ find: "  +", replace: " ", isRegex: true }],
  },
  {
    label: "Remover linhas em branco",
    rules: [{ find: "^\\s*$\\n", replace: "", isRegex: true }],
  },
  {
    label: "Remover tags HTML",
    rules: [{ find: "<[^>]+>", replace: "", isRegex: true }],
  },
  {
    label: "Remover números",
    rules: [{ find: "\\d+", replace: "", isRegex: true }],
  },
  {
    label: "Remover pontuação",
    rules: [{ find: "[.,!?;:\"'()]", replace: "", isRegex: true }],
  },
];

let nextRuleId = 1;

function applyRules(text: string, rules: Rule[]): string {
  let result = text;
  for (const rule of rules) {
    if (!rule.enabled || !rule.find) continue;
    try {
      if (rule.isRegex) {
        const rx = new RegExp(rule.find, "gm");
        result = result.replace(rx, rule.replace);
      } else {
        result = result.split(rule.find).join(rule.replace);
      }
    } catch {
      // invalid regex — skip
    }
  }
  return result;
}

export default function TextCleanerPage() {
  const [input, setInput] = useState("");
  const [rules, setRules] = useState<Rule[]>([]);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => applyRules(input, rules), [input, rules]);

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      { id: nextRuleId++, find: "", replace: "", enabled: true, isRegex: false },
    ]);
  };

  const updateRule = (id: number, field: keyof Rule, value: string | boolean) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const removeRule = (id: number) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const applyPreset = (preset: Preset) => {
    const newRules: Rule[] = preset.rules.map((r) => ({
      ...r,
      id: nextRuleId++,
      enabled: true,
    }));
    setRules((prev) => [...prev, ...newRules]);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const inputLines = input.split("\n").length;
  const outputLines = output.split("\n").length;
  const inputChars = input.length;
  const outputChars = output.length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>
          ← Ferramentas
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          ✂️ Limpeza de Texto
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Cole um texto, defina regras de substituição e veja o resultado em tempo real.
        </p>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>
          AÇÕES RÁPIDAS
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                color: "var(--text-muted)",
                cursor: "pointer",
                transition: "border-color 0.1s, color 0.1s",
              }}
              className="preset-btn"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: rules.length > 0 ? 16 : 0 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
            REGRAS ({rules.length})
          </span>
          <button
            onClick={addRule}
            style={{
              background: "var(--accent)",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            + Nova regra
          </button>
        </div>
        {rules.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: "8px 0 0" }}>
            Nenhuma regra ainda. Use as ações rápidas ou clique em "Nova regra".
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rules.map((rule) => (
            <div
              key={rule.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: rule.enabled ? 1 : 0.45,
                flexWrap: "wrap",
              }}
            >
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={(e) => updateRule(rule.id, "enabled", e.target.checked)}
                style={{ cursor: "pointer", accentColor: "var(--accent)" }}
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={rule.find}
                onChange={(e) => updateRule(rule.id, "find", e.target.value)}
                style={{
                  flex: 2,
                  minWidth: 120,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "7px 12px",
                  fontSize: 13,
                  color: "var(--text)",
                  fontFamily: rule.isRegex ? "monospace" : "inherit",
                }}
              />
              <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>→</span>
              <input
                type="text"
                placeholder="Substituir por..."
                value={rule.replace}
                onChange={(e) => updateRule(rule.id, "replace", e.target.value)}
                style={{
                  flex: 2,
                  minWidth: 120,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "7px 12px",
                  fontSize: 13,
                  color: "var(--text)",
                }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}>
                <input
                  type="checkbox"
                  checked={rule.isRegex}
                  onChange={(e) => updateRule(rule.id, "isRegex", e.target.checked)}
                  style={{ accentColor: "var(--accent)" }}
                />
                regex
              </label>
              <button
                onClick={() => removeRule(rule.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                  padding: "0 4px",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Text areas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span>ENTRADA</span>
            <span>{inputChars} chars · {inputLines} linhas</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cole seu texto aqui..."
            style={{
              width: "100%",
              height: 360,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 16,
              color: "var(--text)",
              fontSize: 13,
              lineHeight: 1.7,
              resize: "vertical",
              fontFamily: "monospace",
            }}
          />
          <button
            onClick={() => setInput("")}
            style={{
              marginTop: 8,
              background: "none",
              border: "none",
              fontSize: 12,
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Limpar
          </button>
        </div>

        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span>SAÍDA</span>
            <span>
              {outputChars} chars · {outputLines} linhas
              {inputChars > 0 && (
                <span style={{ color: outputChars < inputChars ? "#10b981" : "var(--text-muted)", marginLeft: 6 }}>
                  ({inputChars - outputChars > 0 ? `-${inputChars - outputChars}` : `+${outputChars - inputChars}`})
                </span>
              )}
            </span>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Resultado aparece aqui..."
            style={{
              width: "100%",
              height: 360,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 16,
              color: "var(--text)",
              fontSize: 13,
              lineHeight: 1.7,
              resize: "vertical",
              fontFamily: "monospace",
            }}
          />
          <button
            onClick={copy}
            style={{
              marginTop: 8,
              background: "none",
              border: "none",
              fontSize: 12,
              color: copied ? "#10b981" : "var(--text-muted)",
              cursor: "pointer",
              padding: 0,
              transition: "color 0.2s",
            }}
          >
            {copied ? "✓ Copiado!" : "Copiar resultado"}
          </button>
        </div>
      </div>

      <style>{`
        .preset-btn:hover { border-color: var(--text-subtle) !important; color: var(--text) !important; }
      `}</style>
    </div>
  );
}
