import Link from "next/link";

const tools = [
  {
    slug: "color-palette",
    icon: "🎨",
    name: "Paleta de Cores",
    description: "Gere paletas harmônicas a partir de uma cor base: complementares, análogas, tríade e mais.",
    color: "#ec4899",
  },
  {
    slug: "css-units",
    icon: "📐",
    name: "Conversor CSS",
    description: "Converta entre px, rem, em, vw e vh com font-size base configurável.",
    color: "#6366f1",
  },
  {
    slug: "gradients",
    icon: "🌈",
    name: "Gerador de Gradientes",
    description: "Crie gradientes CSS com controle visual de cores, stops e ângulo. Copie o código pronto.",
    color: "#0ea5e9",
  },
  {
    slug: "text-cleaner",
    icon: "✂️",
    name: "Limpeza de Texto",
    description: "Cole qualquer texto e aplique regras de substituição e remoção em tempo real.",
    color: "#10b981",
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px" }}>
      <div style={{ marginBottom: 56 }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            marginBottom: 12,
          }}
        >
          Ferramentas
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 480 }}>
          Uma coleção de utilitários pequenos e focados para o dia a dia do desenvolvimento.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 24,
                cursor: "pointer",
                transition: "border-color 0.15s, transform 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                height: "100%",
              }}
              className="tool-card"
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${tool.color}18`,
                  border: `1px solid ${tool.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                {tool.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {tool.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {tool.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .tool-card:hover {
          border-color: var(--text-subtle) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
