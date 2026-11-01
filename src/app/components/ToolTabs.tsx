"use client";

import { Suspense, useId, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Icon } from "@phosphor-icons/react";

export interface ToolTab {
  id: string;
  label: string;
  icon: Icon;
  content: ReactNode;
}

/** Abas sublinhadas (mesmo estilo da Paleta). A aba ativa vai em `?tipo=` para os redirects das páginas antigas. */
function TabsInner({ tabs, label }: { tabs: ToolTab[]; label: string }) {
  const uid = useId();
  const router = useRouter();
  const pathname = usePathname();
  const fromQuery = useSearchParams().get("tipo");
  const [active, setActive] = useState(tabs.find((t) => t.id === fromQuery)?.id ?? tabs[0].id);
  // Abas já abertas continuam montadas: trocar de aba não apaga o que foi digitado.
  const [visited, setVisited] = useState<string[]>([active]);

  function select(id: string) {
    setActive(id);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
    router.replace(`${pathname}?tipo=${id}`, { scroll: false });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div role="tablist" aria-label={label} style={{ display: "flex", gap: 20, borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
        {tabs.map(({ id, label: text, icon: TabIcon }) => {
          const isActive = id === active;
          return (
            <button key={id} role="tab" id={`${uid}-tab-${id}`} aria-selected={isActive} aria-controls={`${uid}-panel-${id}`} type="button" onClick={() => select(id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 0", marginBottom: -1, minHeight: 44, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "none", border: "none", whiteSpace: "nowrap", borderBottom: `2px solid ${isActive ? "var(--text)" : "transparent"}`, color: isActive ? "var(--text)" : "var(--text-muted)" }}>
              <TabIcon size={18} /> {text}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => visited.includes(t.id) && (
        <div key={t.id} role="tabpanel" id={`${uid}-panel-${t.id}`} aria-labelledby={`${uid}-tab-${t.id}`} hidden={t.id !== active}>
          {t.content}
        </div>
      ))}
    </div>
  );
}

export default function ToolTabs(props: { tabs: ToolTab[]; label: string }) {
  return (
    <Suspense fallback={null}>
      <TabsInner {...props} />
    </Suspense>
  );
}
