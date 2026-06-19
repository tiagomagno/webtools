"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LayoutDashboard, X, Check } from "lucide-react";
import { useState } from "react";
import { usePinnedTools } from "../hooks/usePinnedTools";
import { TOOLS } from "../lib/tools";

export default function MobileLayout() {
  const pathname = usePathname();
  const { pinned, toggle, mounted, MAX_PINS } = usePinnedTools();
  const [editing, setEditing] = useState(false);

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
        <button
          onClick={() => setEditing(true)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
          aria-label="Personalizar atalhos"
        >
          <Settings size={20} color="var(--text-muted)" strokeWidth={1.6} />
        </button>
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
            onClick={() => setEditing(true)}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, border: "1.5px dashed var(--text-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-subtle)", lineHeight: 1 }}>+</span>
            </div>
            <span style={{ fontSize: 10, color: "var(--text-subtle)" }}>Fixar</span>
          </button>
        ))}
      </nav>

      {/* Customize Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div
            onClick={() => setEditing(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />
          <div style={{ position: "relative", background: "var(--surface)", borderRadius: "20px 20px 0 0", maxHeight: "82vh", overflowY: "auto", paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}>
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 6px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
            </div>

            <div style={{ padding: "0 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Personalizar atalhos</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                  Escolha até {MAX_PINS} ferramentas para o menu inferior
                </div>
              </div>
              <button
                onClick={() => setEditing(false)}
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>

            <div style={{ padding: "0 20px" }}>
              {/* Preview fixados */}
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                Fixados ({pinned.length}/{MAX_PINS})
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {pinned.length === 0 ? (
                  <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>Nenhum fixado</span>
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
      )}
    </>
  );
}
