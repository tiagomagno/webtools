"use client";

import { useState, useCallback, useEffect } from "react";
import { generatePassword, estimateStrength, type PasswordOptions } from "../../lib/password";

const STRENGTH_COLORS = ["var(--border)", "#ef4444", "#f59e0b", "#22c55e", "#10b981"];

export default function PasswordGenerator() {
  const [opts, setOpts] = useState<PasswordOptions>({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: false,
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const regen = useCallback((o: PasswordOptions) => {
    try {
      setPassword(generatePassword(o));
      setError("");
    } catch (e) {
      setPassword("");
      setError(e instanceof Error ? e.message : "Erro.");
    }
  }, []);

  useEffect(() => { regen(opts); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (patch: Partial<PasswordOptions>) => {
    const next = { ...opts, ...patch };
    setOpts(next);
    regen(next);
  };

  const strength = estimateStrength(opts);

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const toggle = (key: keyof PasswordOptions, label: string) => (
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text)", cursor: "pointer", padding: "8px 0" }}>
      <input type="checkbox" checked={opts[key] as boolean} onChange={(e) => update({ [key]: e.target.checked })} />
      {label}
    </label>
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Senha gerada */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, fontSize: 20, fontFamily: "monospace", color: password ? "var(--text)" : "var(--text-subtle)", wordBreak: "break-all", letterSpacing: "0.02em" }}>
            {password || "—"}
          </div>
          <button onClick={() => regen(opts)} title="Gerar outra" style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 16, cursor: "pointer" }}>↻</button>
          <button onClick={copy} disabled={!password} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: password ? "var(--accent)" : "var(--surface-2)", color: password ? "#fff" : "var(--text-subtle)", fontSize: 14, fontWeight: 700, cursor: password ? "pointer" : "not-allowed" }}>
            {copied ? "✓" : "Copiar"}
          </button>
        </div>
        {/* Medidor */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: i <= strength.score ? STRENGTH_COLORS[strength.score] : "var(--surface-2)" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{strength.label}</span>
            <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>≈ {strength.bits} bits de entropia</span>
          </div>
        </div>
      </div>

      {/* Opções */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>COMPRIMENTO</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{opts.length}</span>
          </div>
          <input type="range" min={4} max={64} value={opts.length} onChange={(e) => update({ length: Number(e.target.value) })} style={{ width: "100%" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
          {toggle("lowercase", "Minúsculas (a-z)")}
          {toggle("uppercase", "Maiúsculas (A-Z)")}
          {toggle("numbers", "Números (0-9)")}
          {toggle("symbols", "Símbolos (!@#$)")}
          {toggle("avoidAmbiguous", "Evitar ambíguos (O0lI1)")}
        </div>
        {error && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 10 }}>{error}</div>}
      </div>
    </div>
  );
}
