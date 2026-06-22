"use client";

import { useState } from "react";
import { validateCpf, formatCpf } from "../../lib/cpf-cnpj";

export default function CpfValidator() {
  const [input, setInput] = useState("");

  const formatted = formatCpf(input);
  const digits = input.replace(/\D/g, "");
  const result = digits.length === 11 ? validateCpf(digits) : null;

  const color = result ? (result.valid ? "#22c55e" : "#ef4444") : "var(--text-muted)";
  const icon = result ? (result.valid ? "✓" : "✗") : null;

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>CPF</label>
      <input
        value={formatted}
        onChange={e => setInput(e.target.value)}
        placeholder="000.000.000-00"
        maxLength={14}
        style={{ width: "100%", background: "var(--surface)", border: `2px solid ${result ? color : "var(--border)"}`, borderRadius: 10, padding: "12px 16px", color: "var(--text)", fontSize: 22, fontFamily: "monospace", letterSpacing: 2, transition: "border-color .2s" }}
      />

      {result && (
        <div style={{ marginTop: 16, background: result.valid ? "#22c55e15" : "#ef444415", border: `1px solid ${color}`, borderRadius: 10, padding: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>{result.valid ? "CPF Válido" : "CPF Inválido"}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{result.message}</div>
          </div>
        </div>
      )}

      {!input && (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", marginTop: 20 }}>Digite um CPF para validar os dígitos verificadores.</p>
      )}
    </div>
  );
}
