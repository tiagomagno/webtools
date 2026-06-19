import Link from "next/link";
import { TOOLS, CATEGORIES } from "./lib/tools";

export default function Home() {
  return (
    <div style={{ padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>
          Início
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Todas as ferramentas disponíveis.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
        {[
          { label: "Ferramentas", value: TOOLS.length },
          { label: "Categorias", value: CATEGORIES.length },
          { label: "100% gratuito", value: "✓" },
          { label: "Sem upload", value: "✓" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "14px 20px",
              minWidth: 110,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tools by category */}
      {CATEGORIES.map((cat) => {
        const catTools = TOOLS.filter((t) => t.category === cat);
        return (
          <div key={cat} style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
              {cat}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {catTools.map((tool) => (
                <Link key={tool.slug} href={tool.href} style={{ textDecoration: "none" }}>
                  <div
                    className="tool-card"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      cursor: "pointer",
                      transition: "border-color 0.12s, transform 0.12s",
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 9,
                        background: `${tool.color}18`,
                        border: `1px solid ${tool.color}28`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {tool.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                        {tool.label}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                        {tool.description}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <style>{`
        .tool-card:hover { border-color: var(--text-subtle) !important; transform: translateY(-1px); }
        @media (max-width: 767px) {
          .tool-card { padding: 14px !important; }
        }
      `}</style>
    </div>
  );
}
