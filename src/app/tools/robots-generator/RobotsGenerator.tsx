"use client";

import { useState, useMemo } from "react";
import { buildRobotsTxt, type RobotsRule } from "../../lib/seo-tools";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "8px 11px",
  color: "var(--text)",
  fontSize: 13.5,
  fontFamily: "monospace",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-muted)",
  marginBottom: 6,
  display: "block",
};

let ruleId = 0;
function newRule(userAgent = "*"): RobotsRule & { id: number } {
  return { id: ruleId++, userAgent, allow: [], disallow: [] };
}

export default function RobotsGenerator() {
  const [rules, setRules] = useState<Array<RobotsRule & { id: number }>>([
    { ...newRule("*"), disallow: ["/admin/", "/private/"], allow: [] },
  ]);
  const [sitemap, setSitemap] = useState("https://exemplo.com/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () =>
      buildRobotsTxt({
        rules,
        sitemap,
        crawlDelay: crawlDelay ? Number(crawlDelay) : undefined,
      }),
    [rules, sitemap, crawlDelay],
  );

  const updateRule = (id: number, patch: Partial<RobotsRule>) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRule = () => setRules((rs) => [...rs, newRule("*")]);
  const removeRule = (id: number) => setRules((rs) => rs.filter((r) => r.id !== id));

  const toLines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 16 }}>
        {rules.map((rule, i) => (
          <div key={rule.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>Regra {i + 1}</span>
              {rules.length > 1 && (
                <button onClick={() => removeRule(rule.id)} style={{ border: "none", background: "transparent", color: "var(--text-subtle)", fontSize: 12, cursor: "pointer" }}>
                  Remover
                </button>
              )}
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={labelStyle}>User-agent</label>
                <input style={inputStyle} value={rule.userAgent} onChange={(e) => updateRule(rule.id, { userAgent: e.target.value })} placeholder="*" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Disallow (um por linha)</label>
                  <textarea style={{ ...inputStyle, minHeight: 76, resize: "vertical" }} value={rule.disallow.join("\n")} onChange={(e) => updateRule(rule.id, { disallow: toLines(e.target.value) })} placeholder="/admin/" />
                </div>
                <div>
                  <label style={labelStyle}>Allow (um por linha)</label>
                  <textarea style={{ ...inputStyle, minHeight: 76, resize: "vertical" }} value={rule.allow.join("\n")} onChange={(e) => updateRule(rule.id, { allow: toLines(e.target.value) })} placeholder="/public/" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addRule} style={{ alignSelf: "start", padding: "8px 16px", borderRadius: 8, border: "1px dashed var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          + Adicionar regra
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        <div>
          <label style={labelStyle}>Sitemap (URL)</label>
          <input style={inputStyle} value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://exemplo.com/sitemap.xml" />
        </div>
        <div>
          <label style={labelStyle}>Crawl-delay (s)</label>
          <input style={inputStyle} type="number" min={0} value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="opcional" />
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>robots.txt</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={download} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Baixar</button>
            <button onClick={copy} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
          </div>
        </div>
        <pre style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, fontSize: 13, lineHeight: 1.6, overflowX: "auto", color: "var(--text)", whiteSpace: "pre-wrap" }}>{output}</pre>
      </div>
    </div>
  );
}
