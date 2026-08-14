import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { TOOLS, CATEGORIES, CATEGORY_META, categorySlug } from "../../lib/tools";
import { categoryMetadata } from "../../lib/seo";
import type { Metadata } from "next";

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: categorySlug(cat) }));
}

function findCategory(slug: string) {
  return CATEGORIES.find((cat) => categorySlug(cat) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) return {};
  const count = TOOLS.filter((t) => t.category === category).length;
  return categoryMetadata({
    slug,
    title: `${category} — Ferramentas`,
    description: `${count} ferramentas gratuitas de ${category.toLowerCase()}, sem cadastro e sem upload.`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();

  const meta = CATEGORY_META[category] ?? { icon: LayoutGrid, color: "#888" };
  const Icon = meta.icon;
  const catTools = TOOLS.filter((t) => t.category === category);

  return (
    <div style={{ padding: "40px 0" }}>
      <Link href="/" className="back-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textDecoration: "none", marginBottom: 20 }}>
        <ArrowLeft size={14} /> Início
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: `${meta.color}18`, border: `1px solid ${meta.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon size={22} color={meta.color} />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", margin: 0 }}>
            {category}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "2px 0 0" }}>
            {catTools.length} {catTools.length === 1 ? "ferramenta" : "ferramentas"}
          </p>
        </div>
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

      <style>{`
        .tool-card:hover { border-color: var(--text-subtle) !important; transform: translateY(-1px); }
        .back-link:hover { color: var(--text) !important; }
        @media (max-width: 767px) {
          .tool-card { padding: 14px !important; }
        }
      `}</style>
    </div>
  );
}
