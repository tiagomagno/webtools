import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  /** Ausente no último item — indica a página atual, não clicável. */
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, fontSize: 12.5, color: "var(--text-muted)", marginBottom: 16 }}
    >
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
          {i > 0 && <ChevronRight size={12} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />}
          {item.href ? (
            <Link href={item.href} className="breadcrumb-link" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "var(--text)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
      <style>{`.breadcrumb-link:hover { color: var(--text) !important; text-decoration: underline; }`}</style>
    </nav>
  );
}
