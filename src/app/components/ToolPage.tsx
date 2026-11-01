import type { ReactNode } from "react";
import Link from "next/link";
import { TOOLS, categorySlug } from "../lib/tools";
import { SITE_URL } from "../lib/seo";
import Breadcrumbs from "./Breadcrumbs";
import PageHeader from "./PageHeader";

export interface FaqItem {
  q: string;
  a: string;
}

interface ToolPageProps {
  slug: string;
  /** Mantido para compatibilidade com as páginas; o título não usa mais emoji. */
  emoji?: string;
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
  /** Ações alinhadas à direita do título. */
  actions?: ReactNode;
}

export default function ToolPage({
  slug,
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
  actions,
}: ToolPageProps) {
  const path = `/tools/${slug}`;
  const tool = TOOLS.find((t) => t.slug === slug);

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

      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          ...(tool ? [{ label: tool.category, href: `/categoria/${categorySlug(tool.category)}` }] : []),
          { label: title },
        ]}
      />

      <PageHeader title={title} actions={actions}>{heroDescription}</PageHeader>

      {children}
    </div>
  );
}
