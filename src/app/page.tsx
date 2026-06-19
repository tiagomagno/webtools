import Link from "next/link";

const tools = [
  {
    slug: "color-palette",
    icon: "🎨",
    name: "Paleta de Cores",
    description: "Paletas harmônicas a partir de uma cor base.",
    category: "Design",
    color: "#ec4899",
  },
  {
    slug: "gradients",
    icon: "🌈",
    name: "Gradientes",
    description: "Gradientes CSS com animação e múltiplos tipos.",
    category: "Design",
    color: "#0ea5e9",
  },
  {
    slug: "css-units",
    icon: "📐",
    name: "Conversor CSS",
    description: "Converta entre px, rem, em, vw, vh e %.",
    category: "CSS",
    color: "#6366f1",
  },
  {
    slug: "text-cleaner",
    icon: "✂️",
    name: "Limpeza de Texto",
    description: "Substituição e remoção com regex em tempo real.",
    category: "Texto",
    color: "#10b981",
  },
  {
    slug: "pdf-extractor",
    icon: "📄",
    name: "Extrator de Documentos",
    description: "Extrai texto de PDF e DOCX por página, sem upload.",
    category: "Texto",
    color: "#ef4444",
  },
  {
    slug: "pdf-compressor",
    icon: "🗜️",
    name: "Compressão de PDF",
    description: "Reduz o tamanho de PDFs em 3 níveis de qualidade. 100% no browser.",
    category: "Texto",
    color: "#f97316",
  },
  {
    slug: "image-converter",
    icon: "🖼️",
    name: "Conversor de Imagens",
    description: "PNG, JPG, WebP e BMP com controle de qualidade.",
    category: "Imagens",
    color: "#f59e0b",
  },
  {
    slug: "image-upscaler",
    icon: "🔍",
    name: "Aumentar Resolução",
    description: "Upscaling 2×, 4× ou 8× por interpolação bicúbica.",
    category: "Imagens",
    color: "#8b5cf6",
  },
];

const categories = ["Design", "CSS", "Texto", "Imagens"];

export default function Home() {
  return (
    <div style={{ padding: "40px 40px" }}>
      {/* Header */}
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
          { label: tools.length === 1 ? "Ferramenta" : "Ferramentas", value: tools.length },
          { label: "Categorias", value: categories.length },
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
              minWidth: 120,
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
      {categories.map((cat) => {
        const catTools = tools.filter((t) => t.category === cat);
        return (
          <div key={cat} style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
              {cat}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {catTools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} style={{ textDecoration: "none" }}>
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
                      {tool.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                        {tool.name}
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
        .tool-card:hover {
          border-color: var(--text-subtle) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
