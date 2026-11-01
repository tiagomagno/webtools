import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS, CATEGORIES, categorySlug } from "../../lib/tools";
import { categoryMetadata } from "../../lib/seo";
import Breadcrumbs from "../../components/Breadcrumbs";
import { jakarta, kodeMono } from "../../lib/fonts";
import type { Metadata } from "next";
import { ToolIcon, CategoryIcon } from "../../components/ToolIcon";

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

  const catTools = TOOLS.filter((t) => t.category === category);

  return (
    <div className={`${jakarta.variable} ${kodeMono.variable}`} style={{ fontFamily: "var(--font-jakarta), Inter, system-ui, sans-serif" }}>
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: category }]} />

      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0" }}>
        <div
          aria-hidden="true"
          style={{ width: 44, height: 44, flexShrink: 0, background: "var(--accent-strong)", display: "flex", alignItems: "center", justifyContent: "center", clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
        >
          <span style={{ color: "#fff", display: "flex" }}><CategoryIcon category={category} size={22} weight="bold" /></span>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em", color: "var(--text)", margin: 0, flex: 1 }}>
            {category}
          </h1>
          <p style={{ fontSize: 13, lineHeight: "19.5px", color: "var(--text-muted)", margin: 0 }}>
            {catTools.length} {catTools.length === 1 ? "ferramenta" : "ferramentas"}
          </p>
        </div>
      </div>

      <ul className="cat-list" style={{ listStyle: "none", margin: 0, padding: "16px 0" }}>
        {catTools.map((tool) => (
          <li key={tool.slug} style={{ breakInside: "avoid", paddingBottom: 16 }}>
            <Link href={tool.href} style={{ textDecoration: "none", display: "block" }}>
              <div
                className="tool-card cut-box"
                style={{ padding: 16, display: "flex", alignItems: "flex-start", gap: 16, minHeight: 72 }}
              >
                <div
                  aria-hidden="true"
                  className="cut-box" style={{ width: 38, height: 38, ["--cut" as string]: "8px", ["--cut-border" as string]: "color-mix(in srgb, var(--accent) 70%, var(--surface))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}
                >
                  <ToolIcon slug={tool.slug} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: 14, fontWeight: 600, lineHeight: "19.5px", color: "var(--text)" }}>
                    {tool.label}
                  </div>
                  <div style={{ fontSize: 10, lineHeight: "18px", color: "var(--text-muted)" }}>
                    {tool.description}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <style>{`
        .tool-card { transition: none; }
        .tool-card:hover { --cut-border: var(--text-subtle); }
        .cat-list { columns: 1; column-gap: 16px; }
        @media (min-width: 900px) { .cat-list { columns: 2; } }
      `}</style>
    </div>
  );
}
