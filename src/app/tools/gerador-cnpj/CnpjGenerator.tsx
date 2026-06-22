"use client";

import { useState } from "react";
import { generateCnpj } from "../../lib/cpf-cnpj";

export default function CnpjGenerator() {
  const [list, setList] = useState<string[]>([]);
  const [qty, setQty] = useState(5);
  const [formatted, setFormatted] = useState(true);
  const [copiedAll, setCopiedAll] = useState(false);

  function generate() { setList(Array.from({ length: qty }, () => generateCnpj(formatted))); }
  function copyAll() { navigator.clipboard.writeText(list.join("\n")); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 1500); }

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
            {[{ v: true, l: "00.000.000/0000-00" }, { v: false, l: "00000000000000" }].map(({ v, l }) => (
              <button key={l} onClick={() => setFormatted(v)}
                style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, fontFamily: "monospace", background: formatted === v ? "var(--accent)" : "var(--surface)", color: formatted === v ? "#fff" : "var(--text)" }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <button onClick={generate}
          style={{ marginTop: 16, padding: "10px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Gerar CNPJ{qty !== 1 ? "s" : ""}
        </button>
      </div>

      {list.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{list.length} CNPJ{list.length !== 1 ? "S" : ""} GERADO{list.length !== 1 ? "S" : ""}</label>
            <button onClick={copyAll} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>{copiedAll ? "✓ Copiados" : "Copiar todos"}</button>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            {list.map((cnpj, i) => (
              <div key={i} style={{ padding: "10px 14px", borderBottom: i < list.length - 1 ? "1px solid var(--border)" : "none", fontFamily: "monospace", fontSize: 15, color: "var(--accent)", display: "flex", justifyContent: "space-between" }}>
                {cnpj}
                <button onClick={() => navigator.clipboard.writeText(cnpj)}
                  style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer" }}>
                  copiar
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>⚠ CNPJs gerados para fins de teste. Não use para fraudes.</p>
        </>
      )}
    </div>
  );
}
