"use client";

import { useState } from "react";
import { validateCnpj, formatCnpj } from "../../lib/cpf-cnpj";

export default function CnpjValidator() {
  const [input, setInput] = useState("");

  const formatted = formatCnpj(input);
  const digits = input.replace(/\D/g, "");
  const result = digits.length === 14 ? validateCnpj(digits) : null;

  const color = result ? (result.valid ? "#22c55e" : "#ef4444") : "var(--text-muted)";

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>CNPJ</label>
      <input
        value={formatted}
        onChange={e => setInput(e.target.value)}
        placeholder="00.000.000/0000-00"
        maxLength={18}
        style={{ width: "100%", background: "var(--surface)", border: `2px solid ${result ? color : "var(--border)"}`, borderRadius: 10, padding: "12px 16px", color: "var(--text)", fontSize: 20, fontFamily: "monospace", letterSpacing: 1.5, transition: "border-color .2s" }}
      />

      {result && (
        <div style={{ marginTop: 16, background: result.valid ? "#22c55e15" : "#ef444415", border: `1px solid ${color}`, borderRadius: 10, padding: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 28 }}>{result.valid ? "✓" : "✗"}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>{result.valid ? "CNPJ Válido" : "CNPJ Inválido"}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{result.message}</div>
          </div>
        </div>
      )}

      {!input && (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", marginTop: 20 }}>Digite um CNPJ para validar os dígitos verificadores.</p>
      )}
    </div>
  );
}
