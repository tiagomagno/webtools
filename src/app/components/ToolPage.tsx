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
  // We keep these in props to avoid breaking existing pages, but don't render them.
  content,
  faq,
  related = [],
  ctaText,
}: ToolPageProps) {
  const path = `/tools/${slug}`;

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
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL + "/" },
          { "@type": "ListItem", position: 2, name: title, item: SITE_URL + path },
        ],
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
          {emoji} {title}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6, maxWidth: 660 }}>
          {heroDescription}
        </p>
      </header>

      {children}
    </div>
  );
}
