"use client";

import { useEffect, useState } from "react";
import { hashText, type HashAlgo } from "../../lib/hash";

const ALGOS: HashAlgo[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export default function HashGenerator() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (text === "") {
      setHashes({});
      return;
    }
    Promise.all(ALGOS.map((a) => hashText(text, a).then((h) => [a, h] as const))).then((pairs) => {
      if (active) setHashes(Object.fromEntries(pairs));
    });
    return () => {
      active = false;
    };
  }, [text]);

  const copy = (algo: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(algo);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div>
      <label htmlFor="hash-in" style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
        Texto de entrada
      </label>
      <textarea
        id="hash-in"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        spellCheck={false}
        placeholder="Digite o texto para gerar os hashes..."
        style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 14, lineHeight: 1.6, resize: "vertical", fontFamily: "inherit", marginBottom: 16 }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ALGOS.map((algo) => {
          const value = hashes[algo] ?? "";
          return (
            <div key={algo} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", fontFamily: "monospace" }}>{algo}</span>
                <button
                  onClick={() => value && copy(algo, value)}
                  disabled={!value}
                  style={{ fontSize: 11, color: value ? "var(--text-muted)" : "var(--text-subtle)", background: "none", border: "none", cursor: value ? "pointer" : "default" }}
                >
                  {copied === algo ? "✓ copiado" : "copiar"}
                </button>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: "var(--text)", wordBreak: "break-all", minHeight: 18 }}>
                {value || <span style={{ color: "var(--text-subtle)" }}>—</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
