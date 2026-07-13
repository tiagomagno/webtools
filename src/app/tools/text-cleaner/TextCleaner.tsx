"use client";

import { useState, useMemo } from "react";

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

interface LineOptions {
  removeEmpty: boolean;
  trim: boolean;
  removeDuplicates: boolean;
  caseInsensitive: boolean;
  sort: "none" | "asc" | "desc";
}

function processText(text: string, rules: Rule[], opt: LineOptions): string {
  let result = text;
  
  // 1. Apply find/replace rules
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

  // 2. Apply line operations
  let lines = result.split(/\r\n|\r|\n/);

  if (opt.trim) lines = lines.map((l) => l.trim());
  if (opt.removeEmpty) lines = lines.filter((l) => l.trim() !== "");

  if (opt.removeDuplicates) {
    const seen = new Set<string>();
    lines = lines.filter((l) => {
      const key = opt.caseInsensitive ? l.toLowerCase() : l;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  if (opt.sort !== "none") {
    const collator = new Intl.Collator("pt-BR", { sensitivity: opt.caseInsensitive ? "base" : "variant", numeric: true });
    lines = [...lines].sort((a, b) => collator.compare(a, b));
    if (opt.sort === "desc") lines.reverse();
  }

  return lines.join("\n");
}

export default function TextCleaner() {
  const [input, setInput] = useState("");
  const [rules, setRules] = useState<Rule[]>([]);
  const [opt, setOpt] = useState<LineOptions>({
    removeEmpty: false,
    trim: false,
    removeDuplicates: false,
    caseInsensitive: false,
    sort: "none",
  });
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => processText(input, rules, opt), [input, rules, opt]);

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

  const inputLines = input === "" ? 0 : input.split(/\r\n|\r|\n/).length;
  const outputLines = output === "" ? 0 : output.split("\n").length;
  const inputChars = input.length;
  const outputChars = output.length;

  return (
    <div>
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
            REGRAS DE SUBSTITUIÇÃO ({rules.length})
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
            Nenhuma regra de substituição. Use as ações rápidas ou clique em "Nova regra".
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

      {/* Line Operations */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, width: "100%", marginBottom: 4 }}>
          OPERAÇÕES EM LINHAS
        </div>
        {[
          { key: "removeEmpty", label: "Remover vazias" },
          { key: "trim", label: "Remover espaços pontas" },
          { key: "removeDuplicates", label: "Remover duplicadas" },
          { key: "caseInsensitive", label: "Ignorar maiúsc./minúsc." },
        ].map((t) => (
          <label key={t.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
            <input type="checkbox" checked={opt[t.key as keyof LineOptions] as boolean} onChange={(e) => setOpt({ ...opt, [t.key]: e.target.checked })} style={{ accentColor: "var(--accent)" }} />
            {t.label}
          </label>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", marginLeft: "auto" }}>
          <span>Ordenar:</span>
          {(["none", "asc", "desc"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setOpt({ ...opt, sort: s })}
              style={{
                padding: "5px 12px",
                borderRadius: 7,
                border: "1px solid",
                borderColor: opt.sort === s ? "var(--accent)" : "var(--border)",
                background: opt.sort === s ? "var(--accent)" : "var(--surface-2)",
                color: opt.sort === s ? "#fff" : "var(--text-muted)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {s === "none" ? "Não" : s === "asc" ? "A→Z" : "Z→A"}
            </button>
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
