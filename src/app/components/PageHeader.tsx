import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  /** Descrição curta abaixo do título (pode ter destaques em <strong>). */
  children?: ReactNode;
  /** Ações da ferramenta, alinhadas à direita do título. */
  actions?: ReactNode;
}

/** Título e descrição padrão das páginas de ferramenta (Figma "Contraste de Cores", nó 1:2). */
export default function PageHeader({ title, children, actions }: PageHeaderProps) {
  return (
    <header style={{ paddingTop: 8, marginBottom: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: "clamp(28px, 7vw, 40px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.05em", margin: 0, color: "var(--text)" }}>
          {title}
        </h1>
        {children && (
          <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: "22.4px", margin: 0 }}>
            {children}
          </p>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
    </header>
  );
}
