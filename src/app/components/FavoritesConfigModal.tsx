"use client";

import { useEffect } from "react";
import { X, Check } from "lucide-react";
import { usePinnedTools } from "../hooks/usePinnedTools";
import { TOOLS } from "../lib/tools";

export default function FavoritesConfigModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pinned, toggle, MAX_PINS } = usePinnedTools();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      />
      <div style={{ position: "relative", background: "var(--surface)", borderRadius: "20px 20px 0 0", maxHeight: "82vh", maxWidth: 480, width: "100%", margin: "0 auto", overflowY: "auto", paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 6px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
        </div>

        <div style={{ padding: "0 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Configurar favoritos</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              Escolha até {MAX_PINS} ferramentas favoritas
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>

        <div style={{ padding: "0 20px" }}>
          {/* Preview fixados */}
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            Favoritos ({pinned.length}/{MAX_PINS})
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {pinned.length === 0 ? (
              <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>Nenhum favorito</span>
            ) : (
              TOOLS.filter((t) => pinned.includes(t.slug)).map((tool) => (
                <div key={tool.slug} style={{ display: "flex", alignItems: "center", gap: 6, background: `${tool.color}18`, border: `1px solid ${tool.color}40`, borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "var(--text)" }}>
                  <span>{tool.emoji}</span>
                  <span>{tool.label.split(" ")[0]}</span>
                </div>
              ))
            )}
          </div>

          {/* Lista de ferramentas */}
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
            Todas as ferramentas
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TOOLS.map((tool) => {
              const isPinned = pinned.includes(tool.slug);
              const isDisabled = !isPinned && pinned.length >= MAX_PINS;
              const Icon = tool.icon;
              return (
                <button
                  key={tool.slug}
                  onClick={() => !isDisabled && toggle(tool.slug)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 12,
                    border: "1px solid",
                    borderColor: isPinned ? `${tool.color}60` : "var(--border)",
                    background: isPinned ? `${tool.color}10` : "var(--surface-2)",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.35 : 1,
                    textAlign: "left", width: "100%",
                    transition: "all 0.1s",
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${tool.color}18`, border: `1px solid ${tool.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={17} color={tool.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{tool.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{tool.description}</div>
                  </div>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", border: "1.5px solid", borderColor: isPinned ? tool.color : "var(--border)", background: isPinned ? tool.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {isPinned && <Check size={13} color="#fff" strokeWidth={2.5} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
