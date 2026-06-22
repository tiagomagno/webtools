"use client";

import { useState } from "react";

interface Check { label: string; ok: boolean; }

function analyzeEmail(email: string): { valid: boolean; checks: Check[] } {
  const checks: Check[] = [];

  const hasAt = email.includes("@");
  checks.push({ label: "Contém @", ok: hasAt });

  const parts = email.split("@");
  const local = parts[0] ?? "";
  const domain = parts[1] ?? "";

  checks.push({ label: "Parte local não vazia", ok: local.length > 0 });
  checks.push({ label: "Domínio presente", ok: domain.length > 0 });

  const hasDot = domain.includes(".");
  checks.push({ label: "Domínio com ponto", ok: hasDot });

  const tld = domain.split(".").pop() ?? "";
  checks.push({ label: "TLD com 2+ caracteres", ok: tld.length >= 2 });

  const noSpaces = !/\s/.test(email);
  checks.push({ label: "Sem espaços", ok: noSpaces });

  const noConsecDots = !/\.{2,}/.test(email);
  checks.push({ label: "Sem pontos consecutivos", ok: noConsecDots });

  const localOk = /^[a-zA-Z0-9._%+\-]+$/.test(local);
  checks.push({ label: "Caracteres válidos (local)", ok: localOk });

  const domainOk = /^[a-zA-Z0-9.\-]+$/.test(domain);
  checks.push({ label: "Caracteres válidos (domínio)", ok: domainOk });

  const totalOk = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
  const valid = totalOk && noSpaces && noConsecDots;

  return { valid, checks };
}

export default function EmailValidator() {
  const [input, setInput] = useState("");

  const { valid, checks } = input ? analyzeEmail(input) : { valid: false, checks: [] };
  const color = input ? (valid ? "#22c55e" : "#ef4444") : "var(--border)";

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>E-MAIL</label>
      <input
        type="email"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="nome@exemplo.com.br"
        style={{ width: "100%", background: "var(--surface)", border: `2px solid ${color}`, borderRadius: 10, padding: "12px 16px", color: "var(--text)", fontSize: 18, transition: "border-color .2s", marginBottom: 16 }}
      />

      {input && (
        <>
          <div style={{ marginBottom: 16, background: valid ? "#22c55e15" : "#ef444415", border: `1px solid ${color}`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{valid ? "✓" : "✗"}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color }}>{valid ? "E-mail válido" : "E-mail inválido"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {checks.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <span style={{ color: c.ok ? "#22c55e" : "#ef4444", fontSize: 16, minWidth: 18 }}>{c.ok ? "✓" : "✗"}</span>
                <span style={{ color: c.ok ? "var(--text)" : "var(--text-muted)" }}>{c.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
