"use client";

import { useState, useMemo } from "react";

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

function hostOf(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : "https://" + url).hostname.replace(/^www\./, "");
  } catch {
    return "exemplo.com";
  }
}

export default function OpenGraphPreview() {
  const [title, setTitle] = useState("Minha página incrível");
  const [description, setDescription] = useState(
    "Uma descrição curta e atrativa que aparece nos cards de redes sociais quando o link é compartilhado.",
  );
  const [url, setUrl] = useState("https://exemplo.com/artigo");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("Exemplo");
  const [copied, setCopied] = useState(false);

  const host = hostOf(url);

  const metaTags = useMemo(() => {
    const lines = [
      `<meta property="og:type" content="website" />`,
      title && `<meta property="og:title" content="${escapeHtml(title)}" />`,
      description && `<meta property="og:description" content="${escapeHtml(description)}" />`,
      url && `<meta property="og:url" content="${escapeHtml(url)}" />`,
      siteName && `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
      image && `<meta property="og:image" content="${escapeHtml(image)}" />`,
      ``,
      `<meta name="twitter:card" content="summary_large_image" />`,
      title && `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      description && `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
      image && `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    ];
    return lines.filter((l) => l !== false && l !== undefined).join("\n");
  }, [title, description, url, image, siteName]);

  const copy = () => {
    navigator.clipboard.writeText(metaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const ImagePlaceholder = (
    <div
      style={{
        width: "100%",
        aspectRatio: "1200 / 630",
        background: "var(--surface-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-subtle)",
        fontSize: 13,
      }}
    >
      Imagem 1200×630
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Formulário */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gap: 14 }}>
        <div>
          <label style={labelStyle} htmlFor="og-title">Título (og:title)</label>
          <input id="og-title" style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="og-desc">Descrição (og:description)</label>
          <textarea id="og-desc" style={{ ...inputStyle, resize: "vertical", minHeight: 64, fontFamily: "inherit" }} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle} htmlFor="og-url">URL (og:url)</label>
            <input id="og-url" style={inputStyle} value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="og-site">Nome do site (og:site_name)</label>
            <input id="og-site" style={inputStyle} value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle} htmlFor="og-image">Imagem (og:image) — URL pública, 1200×630</label>
          <input id="og-image" style={inputStyle} placeholder="https://exemplo.com/capa.jpg" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
      </div>

      {/* Previews */}
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {/* Facebook / LinkedIn */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Facebook · LinkedIn</div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "var(--surface)" }}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" style={{ width: "100%", aspectRatio: "1200 / 630", objectFit: "cover", display: "block" }} />
            ) : (
              ImagePlaceholder
            )}
            <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "var(--text-subtle)", letterSpacing: "0.04em" }}>{host}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.3, margin: "3px 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{title || "Sem título"}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{description}</div>
            </div>
          </div>
        </div>

        {/* Twitter / X — summary_large_image */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>X (Twitter)</div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", background: "var(--surface)" }}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" style={{ width: "100%", aspectRatio: "1200 / 630", objectFit: "cover", display: "block" }} />
            ) : (
              ImagePlaceholder
            )}
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontSize: 13, color: "var(--text-subtle)" }}>{host}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", lineHeight: 1.3, margin: "2px 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{title || "Sem título"}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{description}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Meta tags */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Meta tags geradas</div>
          <button onClick={copy} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
        <pre style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, fontSize: 12.5, lineHeight: 1.6, overflowX: "auto", color: "var(--text)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{metaTags}</pre>
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
