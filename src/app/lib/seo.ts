import type { Metadata } from "next";

export const SITE_URL = "https://webtools.local";

interface ToolMetaInput {
  slug: string;
  /** Título completo otimizado para SEO. */
  title: string;
  description: string;
}

/** Gera o objeto Metadata padronizado para uma página de ferramenta. */
export function toolMetadata({ slug, title, description }: ToolMetaInput): Metadata {
  const path = `/tools/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: SITE_URL + path,
      type: "website",
      locale: "pt_BR",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
