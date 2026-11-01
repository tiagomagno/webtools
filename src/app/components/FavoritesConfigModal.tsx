"use client";

import { useEffect, useState } from "react";
import { Check, X } from "@phosphor-icons/react";
import { usePinnedTools } from "../hooks/usePinnedTools";
import { TOOLS, CATEGORIES } from "../lib/tools";
import { CategoryIcon, ToolIcon } from "./ToolIcon";

/** Folha inferior para escolher os favoritos do menu do celular: abas por categoria (rolagem horizontal) e ferramentas em 2 colunas. */
export default function FavoritesConfigModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pinned, toggle, MAX_PINS } = usePinnedTools();
  const [category, setCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const tools = TOOLS.filter((t) => t.category === category);
  const full = pinned.length >= MAX_PINS;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
      <div role="dialog" aria-modal="true" aria-label="Configurar favoritos"
        style={{ position: "relative", background: "var(--surface)", borderTop: "1px solid var(--border)", borderRadius: "16px 16px 0 0", height: "50dvh", maxWidth: 560, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div aria-hidden="true" style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
        </div>

        <div style={{ padding: "4px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>Favoritos</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{pinned.length} de {MAX_PINS} escolhidos</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar"
            style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>

        <div role="tablist" aria-label="Categorias" style={{ display: "flex", gap: 20, padding: "0 20px", borderBottom: "1px solid var(--border)", overflowX: "auto", flexShrink: 0 }} className="fav-scroll">
          {CATEGORIES.map((cat) => {
            const active = cat === category;
            return (
              <button key={cat} role="tab" aria-selected={active} type="button" onClick={() => setCategory(cat)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 0", marginBottom: -1, minHeight: 44, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "none", border: "none", whiteSpace: "nowrap", borderBottom: `2px solid ${active ? "var(--text)" : "transparent"}`, color: active ? "var(--text)" : "var(--text-muted)" }}>
                <CategoryIcon category={cat} size={16} /> {cat}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="fav-scroll" style={{ padding: 20, overflowY: "auto", flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, alignContent: "start" }}>
          {tools.map((tool) => {
            const isPinned = pinned.includes(tool.slug);
            const disabled = !isPinned && full;
            return (
              <button key={tool.slug} type="button" aria-pressed={isPinned} disabled={disabled} onClick={() => toggle(tool.slug)}
                style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 48, padding: "8px 10px", borderRadius: 8, textAlign: "left", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, border: `1px solid ${isPinned ? "var(--accent-strong)" : "var(--border)"}`, background: isPinned ? "color-mix(in srgb, var(--accent-strong) 10%, var(--surface))" : "var(--surface)", color: "var(--text)" }}>
                <ToolIcon slug={tool.slug} size={18} />
                <span style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, lineHeight: 1.25, overflowWrap: "anywhere" }}>{tool.label}</span>
                {isPinned && <Check size={16} weight="bold" aria-label="Selecionada" style={{ color: "var(--accent-text)", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      </div>
      <style>{`.fav-scroll { scrollbar-width: none; } .fav-scroll::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
