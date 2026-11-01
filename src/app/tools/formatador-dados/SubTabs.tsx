"use client";

import { useState, type ReactNode } from "react";

export interface SubTab {
  id: string;
  label: string;
  content: ReactNode;
}

/** Abas internas sublinhadas (sem URL), um nível abaixo das abas da ferramenta. */
export default function SubTabs({ tabs, label }: { tabs: SubTab[]; label: string }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" aria-label={label} style={{ display: "flex", gap: 16, marginBottom: 20, borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
        {tabs.map(({ id, label: text }) => {
          const isActive = id === current.id;
          return (
            <button key={id} role="tab" aria-selected={isActive} type="button" onClick={() => setActive(id)}
              style={{ padding: "8px 0", marginBottom: -1, minHeight: 40, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "none", border: "none", whiteSpace: "nowrap", borderBottom: `2px solid ${isActive ? "var(--accent-strong)" : "transparent"}`, color: isActive ? "var(--text)" : "var(--text-muted)" }}>
              {text}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{current.content}</div>
    </div>
  );
}
