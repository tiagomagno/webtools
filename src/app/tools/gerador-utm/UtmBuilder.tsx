"use client";

import { useState, useMemo } from "react";
import { buildUtmUrl } from "../../lib/seo-tools";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "9px 12px",
  color: "var(--text)",
  fontSize: 14,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-muted)",
  marginBottom: 6,
  display: "block",
};

const MEDIUM_SUGGESTIONS = ["cpc", "email", "social", "organic", "referral", "banner", "affiliate"];

export default function UtmBuilder() {
  const [url, setUrl] = useState("https://exemplo.com");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => buildUtmUrl({ url, source, medium, campaign, term, content }),
    [url, source, medium, campaign, term, content],
  );

  const valid = result !== null;
  const hasRequired = source.trim() && medium.trim() && campaign.trim();

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const field = (
    label: string,
    value: string,
    setter: (v: string) => void,
    opts: { required?: boolean; placeholder?: string; list?: string } = {},
  ) => (
    <div>
      <label style={labelStyle}>
        {label} {opts.required && <span style={{ color: "var(--accent)" }}>*</span>}
      </label>
      <input
        style={inputStyle}
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={opts.placeholder}
        list={opts.list}
      />
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gap: 14 }}>
        {field("URL do site", url, setUrl, { required: true, placeholder: "https://exemplo.com/pagina" })}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {field("Origem (utm_source)", source, setSource, { required: true, placeholder: "google, newsletter, instagram" })}
          {field("Mídia (utm_medium)", medium, setMedium, { required: true, placeholder: "cpc, email, social", list: "utm-medium-list" })}
        </div>
        {field("Campanha (utm_campaign)", campaign, setCampaign, { required: true, placeholder: "black-friday-2026" })}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {field("Termo (utm_term)", term, setTerm, { placeholder: "palavra-chave (opcional)" })}
          {field("Conteúdo (utm_content)", content, setContent, { placeholder: "variação do anúncio (opcional)" })}
        </div>
        <datalist id="utm-medium-list">
          {MEDIUM_SUGGESTIONS.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>URL gerada</div>
          <button
            onClick={copy}
            disabled={!valid}
            style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: valid ? "var(--accent)" : "var(--surface-2)", color: valid ? "#fff" : "var(--text-subtle)", fontSize: 13, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed" }}
          >
            {copied ? "✓ Copiado" : "Copiar URL"}
          </button>
        </div>
        <div style={{ background: "var(--surface)", border: `1px solid ${valid ? "var(--border)" : "#ef4444"}`, borderRadius: 10, padding: 14, fontSize: 14, fontFamily: "monospace", color: "var(--text)", wordBreak: "break-all", lineHeight: 1.6, minHeight: 20 }}>
          {valid ? result : <span style={{ color: "#ef4444" }}>URL inválida — verifique o endereço informado.</span>}
        </div>
        {valid && !hasRequired && (
          <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 8 }}>
            Dica: origem, mídia e campanha são os parâmetros recomendados pelo Google Analytics.
          </p>
        )}
      </div>
    </div>
  );
}
