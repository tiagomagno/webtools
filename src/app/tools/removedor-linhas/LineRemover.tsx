"use client";

import { useMemo, useState } from "react";

interface Options {
  removeEmpty: boolean;
  trim: boolean;
  removeDuplicates: boolean;
  caseInsensitive: boolean;
  sort: "none" | "asc" | "desc";
}

function processText(input: string, opt: Options): string {
  let lines = input.split(/\r\n|\r|\n/);

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

const TOGGLES: { key: keyof Omit<Options, "sort">; label: string }[] = [
  { key: "removeEmpty", label: "Remover linhas vazias" },
  { key: "trim", label: "Remover espaços nas pontas" },
  { key: "removeDuplicates", label: "Remover duplicadas" },
  { key: "caseInsensitive", label: "Ignorar maiúsc./minúsc." },
];

export default function LineRemover() {
  const [text, setText] = useState("");
  const [opt, setOpt] = useState<Options>({
    removeEmpty: true,
    trim: true,
    removeDuplicates: true,
    caseInsensitive: false,
    sort: "none",
  });
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => processText(text, opt), [text, opt]);
  const inputCount = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;
  const outputCount = output === "" ? 0 : output.split("\n").length;

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {/* Opções */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        {TOGGLES.map((t) => (
          <label key={t.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
            <input type="checkbox" checked={opt[t.key]} onChange={(e) => setOpt({ ...opt, [t.key]: e.target.checked })} />
            {t.label}
          </label>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        <div>
          <label htmlFor="lr-in" style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
            Entrada — {inputCount} linhas
          </label>
          <textarea
            id="lr-in"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            spellCheck={false}
            placeholder="Cole sua lista de linhas aqui..."
            style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace" }}
          />
        </div>
        <div>
          <label htmlFor="lr-out" style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
            Resultado — {outputCount} linhas
          </label>
          <textarea
            id="lr-out"
            value={output}
            readOnly
            rows={14}
            style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace" }}
          />
          <button
            onClick={copy}
            disabled={output === ""}
            style={{ marginTop: 10, padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: output === "" ? "var(--surface-2)" : "var(--accent)", color: output === "" ? "var(--text-subtle)" : "#fff", fontSize: 13, fontWeight: 600, cursor: output === "" ? "default" : "pointer" }}
          >
            {copied ? "✓ Copiado" : "Copiar resultado"}
          </button>
        </div>
      </div>
    </div>
  );
}
