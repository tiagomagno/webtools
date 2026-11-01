"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS, CATEGORIES, categorySlug } from "../lib/tools";
import ContentHeader from "./ContentHeader";
import { jakarta } from "../lib/fonts";
import { CategoryIcon } from "./ToolIcon";


type Theme = "dark" | "light";
type FontSize = "sm" | "md" | "lg";

interface SiteHeaderProps {
  theme: Theme;
  fontSize: FontSize;
  onToggleTheme: () => void;
  onCycleFont: () => void;
}

/** Cabeçalho global do desktop (Figma "WebTools", nó 1:260): logo, categorias e conta. */
export default function SiteHeader({ theme, fontSize, onToggleTheme, onCycleFont }: SiteHeaderProps) {
  const pathname = usePathname();
  // Categoria da ferramenta aberta, para destacar o item do menu.
  const currentTool = pathname !== "/" ? TOOLS.find((t) => pathname.startsWith(t.href)) : undefined;

  return (
    <header
      className={`site-header cut-box ${jakarta.variable}`}
      style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", fontFamily: "var(--font-jakarta), Inter, system-ui, sans-serif" }}
    >
      <Link href="/" aria-label="webtools — início" title="webtools — início" className="site-header-logo"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: 16, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/webtools-icon.svg" alt="" width={24} height={24} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/webtools-wordmark.svg" alt="" width={102} height={18} className="site-header-wordmark" />
      </Link>

      <div className="site-header-divider" aria-hidden="true" style={{ width: 1, height: 32, background: "var(--border)", flexShrink: 0 }} />

      <nav aria-label="Categorias" style={{ display: "flex", gap: 8, overflow: "hidden" }}>
        {CATEGORIES.map((cat) => {
                    const href = `/categoria/${categorySlug(cat)}`;
          const isActive = pathname === href || currentTool?.category === cat;
          return (
            <Link key={cat} href={href} title={cat} aria-label={cat} aria-current={isActive ? "page" : undefined}
              className="site-header-link"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600, lineHeight: "11.5px", textDecoration: "none", whiteSpace: "nowrap", color: isActive ? "var(--accent-text)" : "var(--text)" }}>
              <CategoryIcon category={cat} />
              <span className="site-header-label">{cat}</span>
            </Link>
          );
        })}
      </nav>

      <div className="site-header-account" style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "flex-end", padding: "0 16px" }}>
        <ContentHeader theme={theme} fontSize={fontSize} onToggleTheme={onToggleTheme} onCycleFont={onCycleFont} />
      </div>

      <style>{`
        .site-header { z-index: 60; }
        .site-header-link:hover { background: var(--surface-2); }
        [data-theme="dark"] .site-header-wordmark { filter: invert(1) hue-rotate(180deg); }
        @media (max-width: 1099px) { .site-header-hint { display: none; } }
        @media (max-width: 899px) { .site-header-label { display: none; } }
      `}</style>
    </header>
  );
}
