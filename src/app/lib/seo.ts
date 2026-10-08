import type { Metadata } from "next";

export const SITE_URL = "https://webtools.tiagosmagno.com.br";

interface ToolMetaInput {
  slug: string;
  /** Título completo otimizado para SEO. */
  title: string;
  description: string;
  /** Palavras-chave da página (meta keywords). */
  keywords?: string[];
}

/** Gera o objeto Metadata padronizado para uma página de ferramenta. */
export function toolMetadata({ slug, title, description, keywords }: ToolMetaInput): Metadata {
  const path = `/tools/${slug}`;
  return {
    title,
    description,
    keywords,
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

interface CategoryMetaInput {
  slug: string;
  title: string;
  description: string;
}

/** Gera o objeto Metadata padronizado para uma página de categoria. */
export function categoryMetadata({ slug, title, description }: CategoryMetaInput): Metadata {
  const path = `/categoria/${slug}`;
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
