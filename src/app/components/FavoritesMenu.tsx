"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Star, Settings } from "lucide-react";
import { usePinnedTools } from "../hooks/usePinnedTools";
import { TOOLS } from "../lib/tools";
import FavoritesConfigModal from "./FavoritesConfigModal";

export default function FavoritesMenu({ placement = "down-right" }: { placement?: "down-right" | "up-left" }) {
  const { pinned, mounted } = usePinnedTools();
  const [open, setOpen] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!mounted) return null;

  const pinnedTools = TOOLS.filter((t) => pinned.includes(t.slug));
  const isUp = placement === "up-left";

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Favoritos"
        aria-label="Favoritos"
        aria-expanded={open}
        aria-haspopup="true"
        className="fav-menu-trigger"
        style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid transparent", background: open ? "var(--surface-2)" : "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
      >
        <Star size={16} strokeWidth={1.8} fill={pinnedTools.length > 0 ? "currentColor" : "none"} />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div
            role="menu"
            aria-label="Favoritos"
            style={{
              position: "absolute", zIndex: 95,
              ...(isUp ? { bottom: "calc(100% + 8px)", left: 0 } : { top: "calc(100% + 8px)", right: 0 }),
              width: 240, background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.16)", padding: 8,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 8px 8px" }}>
              Favoritos
            </div>

            {pinnedTools.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 6 }}>
                {pinnedTools.map((tool) => (
                  <Link key={tool.slug} href={tool.href} onClick={() => setOpen(false)} style={{ textDecoration: "none" }}>
                    <div className="fav-menu-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px", borderRadius: 8 }}>
                      <span style={{ fontSize: 16 }}>{tool.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{tool.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "var(--text-subtle)", padding: "0 8px 8px" }}>
                Nenhum favorito ainda.
              </p>
            )}

            <button
              type="button"
              onClick={() => { setOpen(false); setConfiguring(true); }}
              className="fav-menu-configure"
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8,
                padding: "8px", borderRadius: 8, border: "1px solid var(--border)",
                background: "var(--surface-2)", color: "var(--text-muted)",
                fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              }}
            >
              <Settings size={14} /> Configurar favoritos
            </button>
          </div>
        </>
      )}

      <FavoritesConfigModal open={configuring} onClose={() => setConfiguring(false)} />

      <style>{`
        .fav-menu-trigger:hover { background: var(--surface-2) !important; color: var(--text) !important; }
        .fav-menu-row:hover { background: var(--surface-2); }
        .fav-menu-configure:hover { color: var(--text) !important; border-color: var(--text-subtle) !important; }
      `}</style>
    </div>
  );
}
