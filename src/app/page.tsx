"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Clock, ArrowRight, ChevronRight, LayoutGrid, Wrench, Sparkles } from "lucide-react";
import { TOOLS, CATEGORIES, CATEGORY_META, categorySlug } from "./lib/tools";
import { useRecentTools } from "./hooks/useRecentTools";

export default function Home() {
  const [query, setQuery] = useState("");
  const { recent, mounted: recentMounted } = useRecentTools();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return TOOLS.filter(
      (t) => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const recentTools = recentMounted
    ? (recent.map((slug) => TOOLS.find((t) => t.slug === slug)).filter(Boolean) as typeof TOOLS)
    : [];

  const spotlightCategory = useMemo(() => {
    const counts = CATEGORIES.map((c) => ({ c, n: TOOLS.filter((t) => t.category === c).length }));
    return counts.sort((a, b) => b.n - a.n)[0].c;
  }, []);
  const spotlightCount = TOOLS.filter((t) => t.category === spotlightCategory).length;

  return (
    <div style={{ padding: "40px 0" }}>
      {/* ── Busca compacta ───────────────────────────────────────────────── */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ferramentas"
          style={{
            width: "100%",
            fontSize: 15,
            padding: "11px 14px 11px 40px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            outline: "none",
          }}
        />
        {(results.length > 0 || (query.trim() && results.length === 0)) && (
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 30, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
            {results.length > 0 ? (
              results.map((tool) => (
                <Link key={tool.slug} href={tool.href} style={{ textDecoration: "none" }}>
                  <div className="dash-row">
                    <span style={{ fontSize: 16 }}>{tool.emoji}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{tool.label}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
                  </div>
                </Link>
              ))
            ) : (
              <p style={{ padding: 8, fontSize: 13, color: "var(--text-subtle)" }}>
                Nenhuma ferramenta encontrada.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Ferramentas + Destaque ───────────────────────────────────────── */}
      <div className="dash-top-grid" style={{ marginBottom: 12 }}>
        {/* Estatísticas */}
        <a href="#categorias" style={{ textDecoration: "none" }}>
          <div className="dash-card dash-card-link" style={{ position: "relative", cursor: "pointer", height: "100%", minHeight: 156, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Wrench size={20} strokeWidth={2.2} title="Total de ferramentas" style={{ position: "absolute", top: 18, right: 20, color: "var(--text-muted)" }} />
            <div>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--accent)" }}>
                {TOOLS.length}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>
                Ferramentas
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 2 }}>
              Ver categorias <ChevronRight size={16} />
            </div>
          </div>
        </a>

        {/* Destaque de categoria */}
        <Link href={`/categoria/${categorySlug(spotlightCategory)}`} style={{ textDecoration: "none" }}>
          <div
            className="dash-card dash-card-link"
            style={{
              position: "relative",
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)",
              color: "#fff",
              cursor: "pointer",
              height: "100%",
              minHeight: 156,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Sparkles size={20} strokeWidth={2.2} title="Categoria em destaque" style={{ position: "absolute", top: 18, right: 20, opacity: 0.9 }} />
            <div>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {spotlightCount}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginTop: 4 }}>
                Ferramentas de {spotlightCategory}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
              Explorar <ChevronRight size={16} />
            </div>
          </div>
        </Link>
      </div>

      {/* ── Últimas ferramentas ──────────────────────────────────────────── */}
      <div className="dash-card" style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Clock size={15} style={{ color: "var(--text-muted)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
            Últimas ferramentas
          </span>
        </div>
        {recentTools.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentTools.map((tool) => (
              <Link key={tool.slug} href={tool.href} style={{ textDecoration: "none" }}>
                <div className="dash-row">
                  <span style={{ fontSize: 16 }}>{tool.emoji}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{tool.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>{tool.category}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "var(--text-subtle)" }}>
            Nenhuma ferramenta visitada ainda. Explore o catálogo abaixo.
          </p>
        )}
      </div>

      {/* ── Categorias ───────────────────────────────────────────────────── */}
      <div id="categorias" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, scrollMarginTop: 24 }}>
        <LayoutGrid size={15} style={{ color: "var(--text-muted)" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
          Todas as categorias
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 36 }}>
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat] ?? { icon: LayoutGrid, color: "#888" };
          const CatIcon = meta.icon;
          return (
            <Link key={cat} href={`/categoria/${categorySlug(cat)}`} style={{ textDecoration: "none" }}>
              <div className="cat-card">
                <div
                  style={{
                    width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                    background: `${meta.color}18`, border: `1px solid ${meta.color}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <CatIcon size={18} color={meta.color} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
                  {cat}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .tool-card:hover { border-color: var(--text-subtle) !important; transform: translateY(-1px); }
        .cat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: border-color 0.12s, transform 0.12s;
        }
        .cat-card:hover { border-color: var(--text-subtle); transform: translateY(-1px); }
        .dash-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px 20px;
        }
        .dash-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.12s;
        }
        .dash-row:hover { background: var(--surface-2); }
        .dash-card-link { transition: transform 0.12s, border-color 0.12s; }
        .dash-card-link:hover { transform: translateY(-1px); border-color: var(--text-subtle); }
        .dash-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          align-items: stretch;
        }
        @media (max-width: 767px) {
          .tool-card { padding: 14px !important; }
        }
      `}</style>
    </div>
  );
}
