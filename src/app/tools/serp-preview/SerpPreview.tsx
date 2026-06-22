"use client";

import { useState, useMemo } from "react";
import { titlePx, descPx, SERP_TITLE_LIMIT_PX, SERP_DESC_LIMIT_PX } from "../../lib/seo-tools";

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

function breadcrumb(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : "https://" + url);
    const parts = u.pathname.split("/").filter(Boolean);
    return [u.hostname.replace(/^www\./, ""), ...parts].join(" › ");
  } catch {
    return url || "exemplo.com";
  }
}

function Meter({ label, px, limit }: { label: string; px: number; limit: number }) {
  const pct = Math.min(100, (px / limit) * 100);
  const over = px > limit;
  const color = over ? "#ef4444" : pct > 85 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-subtle)", marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ color: over ? "#ef4444" : "var(--text-subtle)" }}>
          {px}px / {limit}px {over && "· excede o limite"}
        </span>
      </div>
      <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width .15s" }} />
      </div>
    </div>
  );
}

export default function SerpPreview() {
  const [title, setTitle] = useState("Título da página otimizado para SEO");
  const [url, setUrl] = useState("https://exemplo.com/blog/meu-artigo");
  const [description, setDescription] = useState(
    "Escreva uma meta descrição atrativa de até cerca de 920 pixels que resuma a página e incentive o clique nos resultados de busca.",
  );

  const tPx = useMemo(() => titlePx(title), [title]);
  const dPx = useMemo(() => descPx(description), [description]);
  const crumb = useMemo(() => breadcrumb(url), [url]);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gap: 16 }}>
        <div>
          <label style={labelStyle}>Título (title)</label>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
          <Meter label={`${title.length} caracteres`} px={tPx} limit={SERP_TITLE_LIMIT_PX} />
        </div>
        <div>
          <label style={labelStyle}>URL</label>
          <input style={inputStyle} value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Meta descrição (description)</label>
          <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical", fontFamily: "inherit" }} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={400} />
          <Meter label={`${description.length} caracteres`} px={dPx} limit={SERP_DESC_LIMIT_PX} />
        </div>
      </div>

      {/* Preview Google Desktop */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10 }}>Pré-visualização no Google</div>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#f1f3f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🌐</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 14, color: "#202124" }}>{crumb.split(" › ")[0]}</div>
              <div style={{ fontSize: 12, color: "#4d5156" }}>{crumb}</div>
            </div>
          </div>
          <div style={{ fontSize: 20, color: "#1a0dab", lineHeight: 1.3, marginBottom: 3, fontFamily: "arial, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title || "Título da página"}
          </div>
          <div style={{ fontSize: 14, color: "#4d5156", lineHeight: 1.57, fontFamily: "arial, sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {description}
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 10, lineHeight: 1.6 }}>
          O Google trunca o título por volta de <strong>580px</strong> e a descrição por volta de <strong>920px</strong>.
          A largura em pixels é uma estimativa — o corte real varia conforme o dispositivo e a consulta.
        </p>
      </div>
    </div>
  );
}
