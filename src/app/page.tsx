"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";
import { TOOLS, CATEGORIES, categorySlug } from "./lib/tools";
import { useRecentTools } from "./hooks/useRecentTools";
import { ToolIcon, CategoryIcon } from "./components/ToolIcon";
import PageHeader from "./components/PageHeader";

const kode = "var(--font-kode), ui-monospace, monospace";

export default function Home() {
  const [query, setQuery] = useState("");
  const { recent, mounted: recentMounted } = useRecentTools();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return TOOLS.filter((t) => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const recentTools = recentMounted
    ? (recent.map((slug) => TOOLS.find((t) => t.slug === slug)).filter(Boolean) as typeof TOOLS).slice(0, 5)
    : [];

  const categories = CATEGORIES.map((cat) => ({
    cat,
    tools: TOOLS.filter((t) => t.category === cat),
  }));

  return (
    <div>
      <div className="home-hero">
        <PageHeader title="Webtools">
          {TOOLS.length} ferramentas gratuitas para o dia a dia, direto no navegador e sem cadastro.
        </PageHeader>
      </div>

      {/* Busca */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <MagnifyingGlass size={18} aria-hidden="true" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        <input
          type="search"
          aria-label="Buscar ferramentas"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ferramentas"
          style={{ width: "100%", minHeight: 48, fontSize: 14, padding: "10px 14px 10px 42px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", outline: "none" }}
        />
        {query.trim() && (
          <div role="listbox" aria-label="Resultados" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 30, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
            {results.length > 0 ? (
              results.map((tool) => (
                <Link key={tool.slug} href={tool.href} role="option" aria-selected={false} className="home-row" style={{ textDecoration: "none" }}>
                  <ToolIcon slug={tool.slug} />
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{tool.label}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{tool.category}</span>
                </Link>
              ))
            ) : (
              <p style={{ margin: 0, padding: 8, fontSize: 13, color: "var(--text-muted)" }}>Nenhuma ferramenta encontrada.</p>
            )}
          </div>
        )}
      </div>

      {/* Categorias */}
      <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
        <SquaresFour size={16} aria-hidden="true" /> Categorias
      </h2>
      <div id="categorias" className="home-cats" style={{ marginBottom: 32 }}>
        {categories.map(({ cat, tools }) => (
          <Link key={cat} href={`/categoria/${categorySlug(cat)}`} style={{ textDecoration: "none" }}>
            <div className="cut-box home-card" style={{ padding: 14, height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div aria-hidden="true" className="cut-box" style={{ width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", ["--cut" as string]: "8px", ["--cut-bg" as string]: "var(--accent-strong)", ["--cut-border" as string]: "var(--accent-strong)" }}>
                  <CategoryIcon category={cat} size={20} weight="bold" />
                </div>
                <ArrowRight size={16} aria-hidden="true" style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: kode, fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>{cat}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{tools.length} {tools.length === 1 ? "ferramenta" : "ferramentas"}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Últimas ferramentas */}
      <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
        <Clock size={16} aria-hidden="true" /> Últimas ferramentas
      </h2>
      <div className="cut-box" style={{ padding: 8 }}>
        {recentTools.length > 0 ? (
          recentTools.map((tool) => (
            <Link key={tool.slug} href={tool.href} className="home-row" style={{ textDecoration: "none" }}>
              <ToolIcon slug={tool.slug} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{tool.label}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{tool.category}</span>
            </Link>
          ))
        ) : (
          <p style={{ margin: 0, padding: 12, fontSize: 13, color: "var(--text-muted)" }}>
            Nenhuma ferramenta visitada ainda. Escolha uma categoria acima para começar.
          </p>
        )}
      </div>

      <style>{`
        @media (max-width: 767px) { .home-hero { display: none; } }
        .home-cats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 640px) { .home-cats { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
        @media (min-width: 1024px) { .home-cats { grid-template-columns: repeat(5, 1fr); } }
        .home-card:hover { --cut-border: var(--text-subtle); }
        .home-row { display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 8px 10px; border-radius: 8px; }
        .home-row:hover { background: var(--surface-2); }
      `}</style>
    </div>
  );
}
