"use client";

import { useState } from "react";
import { brl, pct } from "../../lib/format";

function parse(v: string) { const n = parseFloat(v.replace(",", ".")); return Number.isFinite(n) ? n : null; }

const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 15, fontFamily: "monospace" };

export default function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const p = parse(price);
  const d = parse(discount);
  const valid = p !== null && d !== null && p >= 0 && d >= 0 && d <= 100;

  const saved = valid ? (p! * d!) / 100 : null;
  const final = valid ? p! - saved! : null;

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>PREÇO ORIGINAL (R$)</label>
          <input inputMode="decimal" placeholder="199,90" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>DESCONTO (%)</label>
          <input inputMode="decimal" placeholder="15" value={discount} onChange={(e) => setDiscount(e.target.value)} style={inputStyle} />
        </div>
      </div>

      {valid ? (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 22, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Preço final</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{brl(final!)}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#10b981" }}>{brl(saved!)}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Você economiza</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{pct(d!)}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>de desconto</div>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 14, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>
          {p !== null && d !== null ? "O desconto deve estar entre 0 e 100%." : "Informe o preço e o desconto para calcular."}
        </p>
      )}
    </div>
  );
}
