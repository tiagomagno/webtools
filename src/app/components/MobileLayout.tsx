"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Plus } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { usePinnedTools } from "../hooks/usePinnedTools";
import { TOOLS, shortLabel } from "../lib/tools";
import MobileUserMenu from "./MobileUserMenu";
import FavoritesConfigModal from "./FavoritesConfigModal";
import { ToolIcon } from "./ToolIcon";

const LONG_PRESS_MS = 500;

const slotStyle: React.CSSProperties = {
  WebkitTouchCallout: "none", userSelect: "none",
  flex: 1, minWidth: 0, minHeight: 56, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  gap: 4, textDecoration: "none", background: "none", border: "none", cursor: "pointer", padding: "6px 2px",
};

export default function MobileLayout() {
  const pathname = usePathname();
  const { pinned, mounted, MAX_PINS } = usePinnedTools();
  const [configuring, setConfiguring] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);

  if (!mounted) return null;

  const pinnedTools = TOOLS.filter((t) => pinned.includes(t.slug));
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href);
  // Toque longo em qualquer atalho abre a escolha de favoritos; o clique que vem depois do toque longo é ignorado.
  const press = {
    onPointerDown: () => {
      longPressed.current = false;
      pressTimer.current = setTimeout(() => { longPressed.current = true; setConfiguring(true); }, LONG_PRESS_MS);
    },
    onPointerUp: () => { if (pressTimer.current) clearTimeout(pressTimer.current); },
    onPointerLeave: () => { if (pressTimer.current) clearTimeout(pressTimer.current); },
    onPointerCancel: () => { if (pressTimer.current) clearTimeout(pressTimer.current); },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onClick: (e: React.MouseEvent) => { if (longPressed.current) { e.preventDefault(); longPressed.current = false; } },
  };
  const color = (active: boolean) => (active ? "var(--accent-text)" : "var(--text-muted)");

  return (
    <>
      {/* Cabeçalho */}
      <header
        className="mobile-header"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, height: 52, background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}
      >
        <Link href="/" aria-label="webtools — início" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/webtools-icon.svg" alt="" width={24} height={24} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/webtools-wordmark.svg" alt="" width={102} height={18} className="mobile-wordmark" />
        </Link>
        <MobileUserMenu />
      </header>

      {/* Menu inferior: Início + 4 favoritos */}
      <nav
        aria-label="Atalhos"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "var(--surface)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "stretch", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <Link href="/" aria-current={isActive("/") ? "page" : undefined} style={slotStyle} {...press}>
          <House size={26} weight={isActive("/") ? "fill" : "regular"} color={color(isActive("/"))} aria-hidden="true" />
          <span style={{ fontSize: 10, fontWeight: isActive("/") ? 700 : 500, color: color(isActive("/")) }}>Início</span>
        </Link>

        {pinnedTools.map((tool) => {
          const active = isActive(tool.href);
          return (
            <Link key={tool.slug} href={tool.href} aria-current={active ? "page" : undefined} style={slotStyle} {...press}>
              <span style={{ display: "flex", color: color(active) }}><ToolIcon slug={tool.slug} size={26} /></span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: color(active), maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {shortLabel(tool)}
              </span>
            </Link>
          );
        })}

        {Array.from({ length: MAX_PINS - pinnedTools.length }).map((_, i) => (
          <button key={`empty-${i}`} type="button" onClick={() => setConfiguring(true)} aria-label="Fixar uma ferramenta" style={slotStyle}>
            <span style={{ width: 26, height: 26, borderRadius: 8, border: "1.5px dashed var(--text-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-subtle)" }}>
              <Plus size={14} weight="bold" aria-hidden="true" />
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-subtle)" }}>Fixar</span>
          </button>
        ))}
      </nav>

      <style>{`[data-theme="dark"] .mobile-wordmark { filter: invert(1) hue-rotate(180deg); }`}</style>

      <FavoritesConfigModal open={configuring} onClose={() => setConfiguring(false)} />
    </>
  );
}
