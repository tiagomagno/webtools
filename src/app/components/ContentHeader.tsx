"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sun, Moon, LogOut, Settings, Type } from "lucide-react";
import { usePinnedTools } from "../hooks/usePinnedTools";
import { TOOLS } from "../lib/tools";
import { useAuth } from "../lib/auth/AuthProvider";
import { initials } from "../lib/initials";
import FavoritesConfigModal from "./FavoritesConfigModal";

type Theme = "dark" | "light";
type FontSize = "sm" | "md" | "lg";

interface ContentHeaderProps {
  theme: Theme;
  fontSize: FontSize;
  onToggleTheme: () => void;
  onCycleFont: () => void;
}

const fontLabel: Record<FontSize, string> = { sm: "Pequena", md: "Média", lg: "Grande" };

export default function ContentHeader({ theme, fontSize, onToggleTheme, onCycleFont }: ContentHeaderProps) {
  const { user, logout } = useAuth();
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

  if (!user || !mounted) return null;

  const statusLabel = user.providers.includes("google") ? "Conectado ao Google" : "Senha local";
  const pinnedTools = TOOLS.filter((t) => pinned.includes(t.slug));
  const close = () => setOpen(false);

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ position: "relative" }}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu do usuário"
          aria-expanded={open}
          aria-haspopup="true"
          style={{
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            padding: "4px 10px 4px 4px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt="" width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {initials(user.name, user.email)}
              </div>
            )}
            <span style={{ position: "absolute", bottom: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: "#22c55e", border: "2px solid var(--surface)" }} />
          </div>
          <div style={{ lineHeight: 1.25, textAlign: "left" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{user.name || user.email}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{statusLabel}</div>
          </div>
        </button>

        {open && (
          <>
            <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
            <div
              role="menu"
              aria-label="Menu do usuário"
              style={{
                position: "absolute", zIndex: 95, top: "calc(100% + 8px)", right: 0,
                width: 260, background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.16)", padding: 8,
              }}
            >
              <Link href="/conta" onClick={close} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 8 }} className="content-header-row">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {initials(user.name, user.email)}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name || user.email}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Minha conta</div>
                </div>
              </Link>

              <div style={{ height: 1, background: "var(--border)", margin: "6px 4px" }} />

              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 8px 8px" }}>
                Favoritos
              </div>

              {pinnedTools.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 6 }}>
                  {pinnedTools.map((tool) => (
                    <Link key={tool.slug} href={tool.href} onClick={close} style={{ textDecoration: "none" }}>
                      <div className="content-header-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 8 }}>
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
                onClick={() => { close(); setConfiguring(true); }}
                className="content-header-configure"
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  padding: 8, borderRadius: 8, border: "1px solid var(--border)",
                  background: "var(--surface-2)", color: "var(--text-muted)",
                  fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginBottom: 6,
                }}
              >
                <Settings size={14} /> Configurar favoritos
              </button>

              <div style={{ height: 1, background: "var(--border)", margin: "6px 4px" }} />

              <button
                type="button"
                onClick={onToggleTheme}
                className="content-header-row"
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: 8, borderRadius: 8, border: "none", background: "none",
                  color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />} Tema
                </span>
                <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>{theme === "dark" ? "Escuro" : "Claro"}</span>
              </button>

              <button
                type="button"
                onClick={onCycleFont}
                className="content-header-row"
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: 8, borderRadius: 8, border: "none", background: "none",
                  color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Type size={15} /> Fonte
                </span>
                <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>{fontLabel[fontSize]}</span>
              </button>

              <div style={{ height: 1, background: "var(--border)", margin: "6px 4px" }} />

              <button
                type="button"
                onClick={() => { close(); void logout(); }}
                className="content-header-row"
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: 8, borderRadius: 8, border: "none", background: "none",
                  color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                <LogOut size={15} /> Sair
              </button>
            </div>
          </>
        )}

        <FavoritesConfigModal open={configuring} onClose={() => setConfiguring(false)} />
      </div>

      <style>{`
        .content-header-row:hover { background: var(--surface-2); }
        .content-header-configure:hover { color: var(--text) !important; border-color: var(--text-subtle) !important; }
      `}</style>
    </div>
  );
}
