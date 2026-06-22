import type { ReactNode } from "react";
import Link from "next/link";
import { TOOLS } from "../lib/tools";
import { SITE_URL } from "../lib/seo";

export interface FaqItem {
  q: string;
  a: string;
}

interface ToolPageProps {
  slug: string;
  emoji: string;
  /** Título curto exibido no H1 (sem cauda de SEO). */
  title: string;
  heroDescription: ReactNode;
  /** Nome usado no schema WebApplication. */
  schemaName: string;
  /** Descrição usada no schema WebApplication. */
  schemaDescription: string;
  /** Ferramenta interativa (client component). */
  children: ReactNode;
  /** Seção de conteúdo indexável (como usar / explicação). */
  content?: { heading: string; body: ReactNode };
  faq: FaqItem[];
  /** Slugs de ferramentas relacionadas. */
  related?: string[];
  ctaText?: string;
}

export default function ToolPage({
  slug,
  emoji,
  title,
  heroDescription,
  schemaName,
  schemaDescription,
  children,
  content,
  faq,
  related = [],
  ctaText = "Precisa de outra ferramenta?",
}: ToolPageProps) {
  const path = `/tools/${slug}`;
  const relatedTools = TOOLS.filter((t) => related.includes(t.slug) && t.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: schemaName,
        url: SITE_URL + path,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        description: schemaDescription,
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL + "/" },
          { "@type": "ListItem", position: 2, name: title, item: SITE_URL + path },
        ],
      },
    ],
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Navegação estrutural" style={{ marginBottom: 16 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
          ← Ferramentas
        </Link>
      </nav>

      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
          {emoji} {title}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6, maxWidth: 660 }}>
          {heroDescription}
        </p>
      </header>

      {children}

      {content && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>
            {content.heading}
          </h2>
          <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7 }}>{content.body}</div>
        </section>
      )}

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
          Perguntas frequentes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faq.map((f) => (
            <details
              key={f.q}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "14px 18px",
              }}
            >
              <summary style={{ fontSize: 14, fontWeight: 600, cursor: "pointer", color: "var(--text)" }}>
                {f.q}
              </summary>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginTop: 10 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {relatedTools.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Ferramentas relacionadas
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {relatedTools.map((t) => (
              <Link key={t.slug} href={t.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{t.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{t.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section
        style={{
          marginTop: 40,
          background: "var(--accent)18",
          border: "1px solid var(--accent)",
          borderRadius: 12,
          padding: "20px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{ctaText}</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
          Explore todas as ferramentas gratuitas, sem cadastro e sem upload.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 22px",
            borderRadius: 8,
            background: "var(--accent)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Ver todas as ferramentas
        </Link>
      </section>
    </div>
  );
}
