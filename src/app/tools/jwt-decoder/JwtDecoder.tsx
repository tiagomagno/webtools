"use client";

import { useMemo, useState } from "react";
import { decodeBase64Url } from "../../lib/base64";

interface Decoded {
  header: string;
  payload: string;
  error: string | null;
  exp?: number;
  iat?: number;
}

function decodeJwt(token: string): Decoded {
  const parts = token.trim().split(".");
  if (parts.length < 2) return { header: "", payload: "", error: "Token JWT inválido — esperado formato header.payload.signature." };
  try {
    const headerObj = JSON.parse(decodeBase64Url(parts[0]));
    const payloadObj = JSON.parse(decodeBase64Url(parts[1]));
    return {
      header: JSON.stringify(headerObj, null, 2),
      payload: JSON.stringify(payloadObj, null, 2),
      error: null,
      exp: typeof payloadObj.exp === "number" ? payloadObj.exp : undefined,
      iat: typeof payloadObj.iat === "number" ? payloadObj.iat : undefined,
    };
  } catch {
    return { header: "", payload: "", error: "Não foi possível decodificar — verifique se o token está completo." };
  }
}

function fmtDate(unix: number): string {
  return new Date(unix * 1000).toLocaleString("pt-BR");
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const decoded = useMemo(() => (token.trim() === "" ? null : decodeJwt(token)), [token]);

  const expired = decoded?.exp ? decoded.exp * 1000 < Date.now() : null;

  const panel: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14 };
  const pre: React.CSSProperties = { margin: 0, fontFamily: "monospace", fontSize: 13, color: "var(--text)", whiteSpace: "pre-wrap", wordBreak: "break-all" };

  return (
    <div>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        rows={5}
        spellCheck={false}
        placeholder="Cole o token JWT (eyJ...)"
        aria-label="Token JWT"
        style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace", marginBottom: 14 }}
      />

      {decoded?.error && (
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13 }}>
          ⚠ {decoded.error}
        </div>
      )}

      {decoded && !decoded.error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(decoded.exp || decoded.iat) && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
              {decoded.iat && <span style={{ color: "var(--text-muted)" }}>Emitido: <strong style={{ color: "var(--text)" }}>{fmtDate(decoded.iat)}</strong></span>}
              {decoded.exp && (
                <span style={{ color: "var(--text-muted)" }}>
                  Expira: <strong style={{ color: expired ? "#f87171" : "#4ade80" }}>{fmtDate(decoded.exp)}{expired ? " (expirado)" : ""}</strong>
                </span>
              )}
            </div>
          )}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Header</div>
            <div style={panel}><pre style={pre}>{decoded.header}</pre></div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Payload</div>
            <div style={panel}><pre style={pre}>{decoded.payload}</pre></div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            ℹ A assinatura não é verificada — esta ferramenta apenas decodifica o conteúdo (que não é criptografado).
          </p>
        </div>
      )}
    </div>
  );
}
