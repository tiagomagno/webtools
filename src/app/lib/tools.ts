import {
  LayoutDashboard,
  Palette,
  Blend,
        FileText,
      CaseSensitive,
    GitCompare,
    Braces,
      Binary,
  Code,
      Hash,
  Share2,
  Bot,
  Tag,
  Search,
    Crop,
  Star,
    Combine,
            QrCode,
    KeySquare,
        CaseUpper,
          Lock,
    FlaskConical,
      Calculator,
    IdCard,
        Home,
  Wallet,
  BarChart3,
  // P3 icons
            Pipette,
    StopCircle,
            Wrench,
  Frame,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Tool {
  slug: string;
  href: string;
  label: string;
  icon: LucideIcon;
  emoji: string;
  description: string;
  category: string;
  subcategory?: string;
  color: string;
}

export const HOME: Tool = {
  slug: "home",
  href: "/",
  label: "Início",
  icon: LayoutDashboard,
  emoji: "🏠",
  description: "Todas as ferramentas disponíveis.",
  category: "",
  color: "#6366f1",
};

export const TOOLS: Tool[] = [
  // ── Design · Cores ──────────────────────────────────────────────────────
  { slug: "color-palette",   href: "/tools/color-palette",   label: "Paleta de Cores",       icon: Palette,      emoji: "🎨", description: "Paletas de 5 cores a partir de uma cor, imagem ou roda, com conversão e exportação.",     category: "Design", subcategory: "Cores", color: "#ec4899" },
  { slug: "contraste-cores", href: "/tools/contraste-cores", label: "Contraste de Cores",    icon: Pipette,      emoji: "🔍", description: "Analise o contraste WCAG entre texto e fundo com sugestões.",  category: "Design", subcategory: "Cores", color: "#8b5cf6" },
  { slug: "gradients",       href: "/tools/gradients",       label: "Gradientes",             icon: Blend,        emoji: "🌈", description: "Gradientes CSS com OKLCH, animações, presets e exportação em SVG, PNG e Tailwind.",         category: "Design", subcategory: "Cores", color: "#0ea5e9" },

  // ── Design · Grid ────────────────────────────────────────────────────────
  { slug: "grid-layouts",    href: "/tools/grid-layouts",    label: "Layouts",                icon: LayoutDashboard, emoji: "📐", description: "Gerador visual de layouts com CSS Grid e Flexbox.", category: "Design", subcategory: "Grid",  color: "#22c55e" },

  // ── Design · Moodboard ───────────────────────────────────────────────────
  { slug: "moodboard",       href: "/tools/moodboard",       label: "Criador de Moodboard",    icon: Frame,        emoji: "📌", description: "Monte moodboards de branding, app mobile ou site com imagens, cores e tipografia.", category: "Design", subcategory: "Moodboard", color: "#d946ef" },

  // ── Design · Imagens ─────────────────────────────────────────────────────
  { slug: "editor-imagem",  href: "/tools/editor-imagem",  label: "Editor de Imagem",       icon: Crop,         emoji: "🖼️", description: "Redimensione, corte, aumente, comprima e converta imagens (PNG, JPG, WebP, HEIC, Base64).",  category: "Design", subcategory: "Imagens", color: "#f97316" },
  { slug: "gerador-favicon", href: "/tools/gerador-favicon", label: "Gerador de Favicon",     icon: Star,         emoji: "⭐", description: "Gere favicons 16–512px com as tags HTML prontas.",      category: "Design", subcategory: "Imagens", color: "#eab308" },

  // ── Dev ──────────────────────────────────────────────────────────────────
  { slug: "formatador-dados", href: "/tools/formatador-dados", label: "Formatador de Dados e Código", icon: Braces, emoji: "🧩", description: "Formate e valide JSON, SQL, HTML, CSS e XML; converta CSV, JSON e Markdown.", category: "Dev", color: "#eab308" },
  { slug: "codificadores", href: "/tools/codificadores", label: "Codificadores", icon: Binary, emoji: "🔢", description: "Codifique e decodifique Base64, URLs e tokens JWT.", category: "Dev", color: "#6366f1" },
  { slug: "hash-uuid", href: "/tools/hash-uuid", label: "Hash e UUID", icon: Hash, emoji: "#️⃣", description: "Gere hashes MD5/SHA e UUIDs v4, um a um ou até 10.000 de uma vez.", category: "Dev", color: "#a855f7" },
  { slug: "conversores-tecnicos", href: "/tools/conversores-tecnicos", label: "Conversores Técnicos", icon: Calculator, emoji: "📐", description: "Bases numéricas, timestamp Unix, tabela ASCII e unidades CSS.", category: "Dev", color: "#22c55e" },
  { slug: "regex-cron", href: "/tools/regex-cron", label: "Regex e Cron", icon: FlaskConical, emoji: "🔎", description: "Teste expressões regulares e traduza expressões cron.", category: "Dev", color: "#f97316" },
  // ── Marketing · SEO ──────────────────────────────────────────────────────
  { slug: "open-graph-preview", href: "/tools/open-graph-preview", label: "Open Graph Preview", icon: Share2,  emoji: "🔗", description: "Veja o card de redes sociais e gere meta tags OG.",      category: "Marketing", subcategory: "SEO", color: "#0ea5e9" },
  { slug: "robots-generator",   href: "/tools/robots-generator",   label: "Gerador de robots.txt", icon: Bot,    emoji: "🤖", description: "Crie robots.txt com Allow, Disallow e Sitemap.",        category: "Marketing", subcategory: "SEO", color: "#64748b" },
  { slug: "gerador-utm",        href: "/tools/gerador-utm",        label: "Gerador de UTM",        icon: Tag,    emoji: "🔖", description: "Monte URLs de campanha com parâmetros UTM.",          category: "Marketing", subcategory: "SEO", color: "#f97316" },
  { slug: "serp-preview",       href: "/tools/serp-preview",       label: "SERP Preview",          icon: Search, emoji: "🔎", description: "Simule o resultado do Google com limites de pixel.",   category: "Marketing", subcategory: "SEO", color: "#22c55e" },

  // ── Utilidades ───────────────────────────────────────────────────────────
  { slug: "analisador-texto", href: "/tools/analisador-texto", label: "Analisador de Texto", icon: CaseSensitive, emoji: "🧰", description: "Conte palavras, linhas e a frequência de letras de um texto.", category: "Utilidades", subcategory: "Texto", color: "#6366f1" },
  { slug: "editor-texto", href: "/tools/editor-texto", label: "Editor de Texto", icon: CaseUpper, emoji: "🧰", description: "Mude a caixa, inverta, ordene, limpe e crie slugs a partir de texto.", category: "Utilidades", subcategory: "Texto", color: "#8b5cf6" },
  { slug: "codificacoes-texto", href: "/tools/codificacoes-texto", label: "Codificações de Texto", icon: Lock, emoji: "🧰", description: "Número por extenso, código Morse e cifra de César.", category: "Utilidades", subcategory: "Texto", color: "#ec4899" },
  { slug: "extrator-documentos", href: "/tools/extrator-documentos", label: "Extrator de Documentos", icon: FileText, emoji: "🧰", description: "Extraia texto de PDF e DOCX ou converta documentos em Markdown.", category: "Utilidades", subcategory: "Arquivos", color: "#0ea5e9" },
  { slug: "ferramentas-pdf", href: "/tools/ferramentas-pdf", label: "Ferramentas de PDF", icon: Combine, emoji: "🧰", description: "Una, divida, comprima e converta PDFs e imagens.", category: "Utilidades", subcategory: "Arquivos", color: "#ef4444" },
  { slug: "qr-code", href: "/tools/qr-code", label: "QR Code", icon: QrCode, emoji: "🧰", description: "Crie QR Codes e leia QR por imagem ou câmera.", category: "Utilidades", subcategory: "Geradores", color: "#0ea5e9" },
  { slug: "geradores", href: "/tools/geradores", label: "Geradores", icon: KeySquare, emoji: "🧰", description: "Senhas, Lorem Ipsum, anagramas e sorteios.", category: "Utilidades", subcategory: "Geradores", color: "#f59e0b" },
  { slug: "documentos-br", href: "/tools/documentos-br", label: "Documentos BR", icon: IdCard, emoji: "🧰", description: "CPF, CNPJ, cartão (Luhn) e telefone: gere, valide e formate.", category: "Utilidades", color: "#22c55e" },
  { slug: "cronometro",         href: "/tools/cronometro",         label: "Cronômetro Online",         icon: StopCircle,  emoji: "⏱️", description: "Cronômetro com laps e timer regressivo — direto no navegador.",    category: "Utilidades", color: "#f97316" },

  // ── Utilidades · Geradores ───────────────────────────────────────────────

  // ── Utilidades · Texto ───────────────────────────────────────────────────
  { slug: "comparador-textos",   href: "/tools/comparador-textos",   label: "Comparador de Textos",   icon: GitCompare,    emoji: "🔀", description: "Compare dois textos e veja as diferenças por linha.",    category: "Utilidades", subcategory: "Texto", color: "#0ea5e9" },

  // ── Utilidades · PDF ─────────────────────────────────────────────────────

  // ── Utilidades · Calculadoras ────────────────────────────────────────────
  { slug: "calculadoras", href: "/tools/calculadoras", label: "Calculadoras", icon: Calculator, emoji: "🧮", description: "Mais de 20 calculadoras (idade, IMC, juros, datas, unidades, área e tinta e mais) em um só lugar, com abas.", category: "Utilidades", subcategory: "Calculadoras", color: "#f97316" },

  // ── Utilidades · Construção ──────────────────────────────────────────────

  // ── Finanças ─────────────────────────────────────────────────────────────
  { slug: "trabalho-impostos", href: "/tools/trabalho-impostos", label: "Trabalho e Impostos", icon: Wallet, emoji: "🧰", description: "Salário líquido, rescisão, INSS autônomo, MEI e aposentadoria.", category: "Finanças", color: "#22c55e" },
  { slug: "imoveis", href: "/tools/imoveis", label: "Imóveis", icon: Home, emoji: "🧰", description: "Simule financiamento (SAC e PRICE) e reajuste de aluguel.", category: "Finanças", color: "#f97316" },
  { slug: "investimentos", href: "/tools/investimentos", label: "Investimentos", icon: BarChart3, emoji: "🧰", description: "Compare CDB, LCI/LCA e poupança e calcule o IR sobre ações.", category: "Finanças", color: "#0ea5e9" },
];

export const CATEGORIES = ["Design", "Dev", "Marketing", "Utilidades", "Finanças"];

export const CATEGORY_META: Record<string, { icon: LucideIcon; color: string }> = {
  "Design":     { icon: Palette,    color: "#ec4899" },
  "Dev":        { icon: Code,       color: "#eab308" },
  "Marketing":  { icon: Megaphone,  color: "#f97316" },
  "Utilidades": { icon: Wrench,     color: "#a855f7" },
  "Finanças":   { icon: Wallet,     color: "#06b6d4" },
};

export const categorySlug = (cat: string) =>
  cat
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

/** Nome curto (uma linha) das ferramentas para o menu inferior do celular. */
const SHORT_LABELS: Record<string, string> = {
  "color-palette": "Paleta", "contraste-cores": "Contraste", gradients: "Gradientes", "grid-layouts": "Layouts", moodboard: "Moodboard",
  "editor-imagem": "Imagem", "gerador-favicon": "Favicon", "formatador-dados": "Dados", codificadores: "Codificar", "hash-uuid": "Hash",
  "conversores-tecnicos": "Conversores", "regex-cron": "Regex", "open-graph-preview": "OG", "robots-generator": "Robots", "gerador-utm": "UTM",
  "serp-preview": "SERP", "analisador-texto": "Analisar", "editor-texto": "Texto", "comparador-textos": "Comparar", "codificacoes-texto": "Cifras",
  "extrator-documentos": "Extrator", "ferramentas-pdf": "PDF", "qr-code": "QR Code", geradores: "Geradores", "documentos-br": "Docs BR",
  cronometro: "Cronômetro", calculadoras: "Calcular", "trabalho-impostos": "Trabalho", imoveis: "Imóveis", investimentos: "Investir",
};

export const shortLabel = (tool: { slug: string; label: string }): string => SHORT_LABELS[tool.slug] ?? tool.label;
