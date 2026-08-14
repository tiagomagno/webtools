"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { usePinnedTools } from "../hooks/usePinnedTools";
import { TOOLS } from "../lib/tools";
import FavoritesMenu from "./FavoritesMenu";
import FavoritesConfigModal from "./FavoritesConfigModal";

export default function MobileLayout() {
  const pathname = usePathname();
  const { pinned, mounted, MAX_PINS } = usePinnedTools();
  const [configuring, setConfiguring] = useState(false);

  if (!mounted) return null;

  const pinnedTools = TOOLS.filter((t) => pinned.includes(t.slug));
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href;

  return (
    <>
      {/* Mobile Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          height: 52,
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="var(--accent)" />
            <rect x="7" y="9" width="5" height="10" rx="1.5" fill="white" opacity="0.9" />
            <rect x="14" y="9" width="7" height="4.5" rx="1.5" fill="white" opacity="0.7" />
            <rect x="14" y="14.5" width="7" height="4.5" rx="1.5" fill="white" opacity="0.5" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
            webtools
          </span>
        </Link>
        <FavoritesMenu />
      </header>

      {/* Bottom Nav — 5 slots: Home + 4 pinned */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "stretch",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Home — sempre fixo */}
        <Link href="/" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <LayoutDashboard
              size={22}
              strokeWidth={isActive("/") ? 2.2 : 1.6}
              color={isActive("/") ? "var(--accent)" : "var(--text-muted)"}
            />
            <span style={{ fontSize: 10, fontWeight: isActive("/") ? 600 : 400, color: isActive("/") ? "var(--accent)" : "var(--text-muted)" }}>
              Início
            </span>
          </div>
        </Link>

        {/* Pinned tools */}
        {pinnedTools.map((tool) => {
          const Icon = tool.icon;
          const active = isActive(tool.href);
          return (
            <Link key={tool.slug} href={tool.href} style={{ textDecoration: "none", flex: 1 }}>
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.6}
                  color={active ? "var(--accent)" : "var(--text-muted)"}
                />
                <span style={{
                  fontSize: 10,
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 60,
                  textAlign: "center",
                }}>
                  {tool.label.split(" ")[0]}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Empty slots placeholder */}
        {Array.from({ length: MAX_PINS - pinnedTools.length }).map((_, i) => (
          <button
            key={`empty-${i}`}
            onClick={() => setConfiguring(true)}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, border: "1.5px dashed var(--text-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-subtle)", lineHeight: 1 }}>+</span>
            </div>
            <span style={{ fontSize: 10, color: "var(--text-subtle)" }}>Fixar</span>
          </button>
        ))}
      </nav>

      <FavoritesConfigModal open={configuring} onClose={() => setConfiguring(false)} />
    </>
  );
}
