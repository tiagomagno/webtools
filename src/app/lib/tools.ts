import {
  LayoutDashboard,
  Palette,
  Blend,
  Ruler,
  Scissors,
  Image,
  ZoomIn,
  FileText,
  FileDown,
  FileArchive,
  PaintBucket,
  CaseSensitive,
  Timer,
  GitCompare,
  ListX,
  Braces,
  BadgeCheck,
  FileDiff,
  Binary,
  Code,
  KeyRound,
  Fingerprint,
  Hash,
  Share2,
  Bot,
  Tag,
  Search,
  FileImage,
  ImagePlus,
  Crop,
  Star,
  FilePlus2,
  Combine,
  Split,
  ArrowLeftRight,
  FileCode,
  Link2,
  Clock,
  QrCode,
  ScanLine,
  KeySquare,
  Dices,
  Droplet,
  Pilcrow,
  CaseUpper,
  Repeat2,
  AlignJustify,
  Eraser,
  ArrowUpDown,
  Lock,
  Languages,
  FlaskConical,
  Code2,
  Minimize2,
  Calculator,
  Table,
  IdCard,
  ShieldCheck,
  Building2,
  Phone,
  Home,
  Wallet,
  BarChart3,
  // P3 icons
  Radio,
  Shuffle,
  BarChart2,
  Globe,
  Settings,
  Pipette,
  CreditCard,
  StopCircle,
  User,
  Store,
  Users,
  Banknote,
  FileCode2,
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
  { slug: "color-palette",   href: "/tools/color-palette",   label: "Paleta de Cores",       icon: Palette,      emoji: "🎨", description: "Roda de cores interativa com harmonias HSL e exportação.",     category: "Design", subcategory: "Cores", color: "#ec4899" },
  { slug: "contraste-cores", href: "/tools/contraste-cores", label: "Contraste de Cores",    icon: Pipette,      emoji: "🔍", description: "Analise o contraste WCAG entre texto e fundo com sugestões.",  category: "Design", subcategory: "Cores", color: "#8b5cf6" },
  { slug: "gradients",       href: "/tools/gradients",       label: "Gradientes",             icon: Blend,        emoji: "🌈", description: "Gradientes CSS com animação e múltiplos tipos.",         category: "Design", subcategory: "Cores", color: "#0ea5e9" },
  { slug: "conversor-cores", href: "/tools/conversor-cores", label: "Conversor de Cores",     icon: Droplet,      emoji: "🎨", description: "Converta entre HEX, RGB e HSL com prévia ao vivo.",      category: "Design", subcategory: "Cores", color: "#a855f7" },

  // ── Design · Grid ────────────────────────────────────────────────────────
  { slug: "grid-layouts",    href: "/tools/grid-layouts",    label: "Layouts",                icon: LayoutDashboard, emoji: "📐", description: "Gerador visual de layouts com CSS Grid e Flexbox.", category: "Design", subcategory: "Grid",  color: "#22c55e" },

  // ── Design · Moodboard ───────────────────────────────────────────────────
  { slug: "moodboard",       href: "/tools/moodboard",       label: "Criador de Moodboard",    icon: Frame,        emoji: "📌", description: "Monte moodboards de branding, app mobile ou site com imagens, cores e tipografia.", category: "Design", subcategory: "Moodboard", color: "#d946ef" },

  // ── Design · Imagens ─────────────────────────────────────────────────────
  { slug: "image-converter", href: "/tools/image-converter", label: "Conversor de Imagens",   icon: Image,        emoji: "🖼️", description: "PNG, JPG, WebP e BMP com controle de qualidade.",       category: "Design", subcategory: "Imagens", color: "#f59e0b" },
  { slug: "compressor-imagem", href: "/tools/compressor-imagem", label: "Compressor de Imagem", icon: FileArchive, emoji: "🗜️", description: "Reduz o peso de JPG, PNG e WebP por qualidade.",        category: "Design", subcategory: "Imagens", color: "#f97316" },
  { slug: "jpg-para-png",    href: "/tools/jpg-para-png",    label: "JPG para PNG",           icon: FileImage,    emoji: "🖼️", description: "Converta JPG para PNG sem perdas.",                     category: "Design", subcategory: "Imagens", color: "#0ea5e9" },
  { slug: "png-para-jpg",    href: "/tools/png-para-jpg",    label: "PNG para JPG",           icon: FileImage,    emoji: "🖼️", description: "Converta PNG para JPG com controle de qualidade.",      category: "Design", subcategory: "Imagens", color: "#eab308" },
  { slug: "webp-converter",  href: "/tools/webp-converter",  label: "Conversor WebP",         icon: ImagePlus,    emoji: "🖼️", description: "Converta JPG e PNG para WebP com menor peso.",          category: "Design", subcategory: "Imagens", color: "#22c55e" },
  { slug: "redimensionador-imagem", href: "/tools/redimensionador-imagem", label: "Redimensionador", icon: Ruler, emoji: "📐", description: "Altere largura e altura por px ou porcentagem.",        category: "Design", subcategory: "Imagens", color: "#6366f1" },
  { slug: "cortador-imagem", href: "/tools/cortador-imagem", label: "Cortador de Imagem",     icon: Crop,         emoji: "✂️", description: "Recorte com seleção interativa e proporções.",          category: "Design", subcategory: "Imagens", color: "#ec4899" },
  { slug: "gerador-favicon", href: "/tools/gerador-favicon", label: "Gerador de Favicon",     icon: Star,         emoji: "⭐", description: "Gere favicons 16–512px com as tags HTML prontas.",      category: "Design", subcategory: "Imagens", color: "#eab308" },
  { slug: "image-upscaler",  href: "/tools/image-upscaler",  label: "Aumentar Resolução",     icon: ZoomIn,       emoji: "🔍", description: "Upscaling 2×, 4× ou 8× por interpolação bicúbica.",     category: "Design", subcategory: "Imagens", color: "#8b5cf6" },
  { slug: "image-to-base64", href: "/tools/image-to-base64", label: "Imagem para Base64",     icon: FileDown,     emoji: "🖼️", description: "Converta imagens para Base64 (data URI) e Base64 de volta.", category: "Design", subcategory: "Imagens", color: "#0ea5e9" },
  { slug: "extrator-cores",  href: "/tools/extrator-cores",  label: "Extrator de Cores",      icon: Pipette,      emoji: "🌈", description: "Extraia as cores dominantes de qualquer imagem como paleta.", category: "Design", subcategory: "Imagens", color: "#ec4899" },

  // ── Dev ──────────────────────────────────────────────────────────────────
  { slug: "json-formatter",  href: "/tools/json-formatter",  label: "Ferramenta JSON",        icon: Braces,       emoji: "🧩", description: "Formate, valide ou compare (Diff) código JSON em abas.",        category: "Dev", color: "#eab308" },
  { slug: "base64-encode",   href: "/tools/base64-encode",   label: "Ferramenta Base64",      icon: Binary,       emoji: "🔢", description: "Codifique e decodifique texto em Base64 (UTF-8).",          category: "Dev", color: "#6366f1" },
  { slug: "jwt-decoder",     href: "/tools/jwt-decoder",     label: "JWT Decoder",            icon: KeyRound,     emoji: "🔐", description: "Decodifique header e payload de um token JWT.",          category: "Dev", color: "#ec4899" },
  { slug: "uuid-generator",  href: "/tools/uuid-generator",  label: "Gerador de UUID",        icon: Fingerprint,  emoji: "🆔", description: "Gere UUIDs v4 únicos com um clique.",                    category: "Dev", color: "#f43f5e" },
  { slug: "hash-generator",  href: "/tools/hash-generator",  label: "Gerador de Hash",        icon: Hash,         emoji: "#️⃣", description: "Gere MD5, SHA-1, SHA-256, SHA-384 e SHA-512.",           category: "Dev", color: "#a855f7" },
  { slug: "markdown-para-html", href: "/tools/markdown-para-html", label: "Markdown para HTML", icon: FileCode, emoji: "📝", description: "Converta Markdown em HTML com preview ao vivo.",         category: "Dev", color: "#0ea5e9" },
  { slug: "unix-timestamp",  href: "/tools/unix-timestamp",  label: "Timestamp Unix",         icon: Clock,        emoji: "⏰", description: "Converta timestamp Unix em data e vice-versa.",          category: "Dev", color: "#06b6d4" },
  { slug: "codificador-url", href: "/tools/codificador-url", label: "Ferramenta de URL",      icon: Globe,        emoji: "🔗", description: "Codifique, decodifique e faça o parser de URLs e parâmetros.",            category: "Dev", color: "#0ea5e9" },
  { slug: "regex-tester",        href: "/tools/regex-tester",        label: "Testador de Regex",      icon: FlaskConical,  emoji: "🔎", description: "Teste expressões regulares em tempo real com highlight de matches.",  category: "Dev", color: "#f97316" },
  { slug: "conversor-bases",     href: "/tools/conversor-bases",     label: "Conversor de Bases",     icon: Calculator,    emoji: "🔢", description: "Converta entre decimal, binário, octal e hexadecimal.",              category: "Dev", color: "#22c55e" },
  { slug: "tabela-ascii",        href: "/tools/tabela-ascii",        label: "Tabela ASCII",           icon: Table,         emoji: "🔣", description: "Tabela ASCII 0–255 com decimal, hex, binário e caractere.",           category: "Dev", color: "#a855f7" },
  { slug: "formatador-codigo",   href: "/tools/formatador-codigo",   label: "Formatador de Código",          icon: Code2,     emoji: "🗄️", description: "Formate e minifique SQL, HTML, CSS e XML.", category: "Dev", color: "#8b5cf6" },
  { slug: "cron-helper",        href: "/tools/cron-helper",        label: "Leitor de Cron",            icon: Settings,    emoji: "⏱️", description: "Traduza expressões cron para português e veja as próximas execuções.", category: "Dev", color: "#6366f1" },

  // ── Dev · CSS ────────────────────────────────────────────────────────────
  { slug: "css-units",       href: "/tools/css-units",       label: "Conversor CSS",          icon: Ruler,        emoji: "📐", description: "Converta entre px, rem, em, vw, vh e %.",                category: "Dev", subcategory: "CSS", color: "#6366f1" },

  // ── Dev · Dados ──────────────────────────────────────────────────────────
  { slug: "csv-para-json",   href: "/tools/csv-para-json",   label: "CSV para JSON",          icon: ArrowLeftRight, emoji: "🔄", description: "Converta CSV em JSON com delimitador e cabeçalho.",    category: "Dev", subcategory: "Dados", color: "#22c55e" },
  { slug: "json-para-csv",   href: "/tools/json-para-csv",   label: "JSON para CSV",          icon: ArrowLeftRight, emoji: "🔄", description: "Converta um array de objetos JSON em CSV.",            category: "Dev", subcategory: "Dados", color: "#eab308" },

  // ── Marketing · SEO ──────────────────────────────────────────────────────
  { slug: "open-graph-preview", href: "/tools/open-graph-preview", label: "Open Graph Preview", icon: Share2,  emoji: "🔗", description: "Veja o card de redes sociais e gere meta tags OG.",      category: "Marketing", subcategory: "SEO", color: "#0ea5e9" },
  { slug: "robots-generator",   href: "/tools/robots-generator",   label: "Gerador de robots.txt", icon: Bot,    emoji: "🤖", description: "Crie robots.txt com Allow, Disallow e Sitemap.",        category: "Marketing", subcategory: "SEO", color: "#64748b" },
  { slug: "gerador-utm",        href: "/tools/gerador-utm",        label: "Gerador de UTM",        icon: Tag,    emoji: "🔖", description: "Monte URLs de campanha com parâmetros UTM.",          category: "Marketing", subcategory: "SEO", color: "#f97316" },
  { slug: "serp-preview",       href: "/tools/serp-preview",       label: "SERP Preview",          icon: Search, emoji: "🔎", description: "Simule o resultado do Google com limites de pixel.",   category: "Marketing", subcategory: "SEO", color: "#22c55e" },

  // ── Utilidades ───────────────────────────────────────────────────────────
  { slug: "leitor-qr",       href: "/tools/leitor-qr",       label: "Leitor de QR Code",      icon: ScanLine,     emoji: "🔍", description: "Leia QR por imagem ou câmera, sem instalar app.",       category: "Utilidades", color: "#0ea5e9" },
  { slug: "uuid-massa",      href: "/tools/uuid-massa",      label: "UUID em Massa",          icon: Fingerprint,  emoji: "🆔", description: "Gere até 10.000 UUIDs v4 e baixe em .txt.",             category: "Utilidades", color: "#a855f7" },
  { slug: "sorteador",       href: "/tools/sorteador",       label: "Sorteador",              icon: Dices,        emoji: "🎲", description: "Sorteie nomes ou números, com ou sem repetição.",       category: "Utilidades", color: "#f59e0b" },
  { slug: "validador-luhn",     href: "/tools/validador-luhn",     label: "Validador Luhn",            icon: ShieldCheck, emoji: "🔍", description: "Valide cartões de crédito pelo algoritmo Luhn e detecte bandeira.", category: "Utilidades", color: "#22c55e" },
  { slug: "cronometro",         href: "/tools/cronometro",         label: "Cronômetro Online",         icon: StopCircle,  emoji: "⏱️", description: "Cronômetro com laps e timer regressivo — direto no navegador.",    category: "Utilidades", color: "#f97316" },
  { slug: "cpf-cnpj",            href: "/tools/cpf-cnpj",            label: "CPF e CNPJ",             icon: IdCard,        emoji: "🪪", description: "Gere ou valide CPF e CNPJ com dígitos verificadores corretos, em uma única ferramenta.", category: "Utilidades", color: "#6366f1" },
  { slug: "formatador-telefone", href: "/tools/formatador-telefone", label: "Formatador de Telefone", icon: Phone,         emoji: "📱", description: "Formate telefones brasileiros e gere o link direto do WhatsApp (wa.me).", category: "Utilidades", color: "#14b8a6" },

  // ── Utilidades · Geradores ───────────────────────────────────────────────
  { slug: "gerador-qr",      href: "/tools/gerador-qr",      label: "Gerador de QR Code",     icon: QrCode,       emoji: "🔳", description: "Crie QR Codes com cores e baixe em PNG ou SVG.",        category: "Utilidades", subcategory: "Geradores", color: "#6366f1" },
  { slug: "gerador-senha",   href: "/tools/gerador-senha",   label: "Gerador de Senhas",      icon: KeySquare,    emoji: "🔑", description: "Senhas fortes com medidor de força e entropia.",        category: "Utilidades", subcategory: "Geradores", color: "#f43f5e" },
  { slug: "gerador-cartao",     href: "/tools/gerador-cartao",     label: "Gerador de Cartão",         icon: CreditCard,  emoji: "💳", description: "Gere números de cartão de crédito válidos pelo algoritmo Luhn.",   category: "Utilidades", subcategory: "Geradores", color: "#6366f1" },
  { slug: "lorem-ipsum",         href: "/tools/lorem-ipsum",         label: "Gerador de Lorem Ipsum", icon: Pilcrow,       emoji: "📄", description: "Texto de preenchimento em parágrafos, frases ou palavras.", category: "Utilidades", subcategory: "Geradores", color: "#06b6d4" },
  { slug: "gerador-anagrama",    href: "/tools/gerador-anagrama",    label: "Gerador de Anagramas",   icon: Shuffle,       emoji: "🔀", description: "Embaralhe letras de palavras ou frases para criar anagramas.",       category: "Utilidades", subcategory: "Geradores", color: "#0ea5e9" },

  // ── Utilidades · Texto ───────────────────────────────────────────────────
  { slug: "contador-palavras",   href: "/tools/contador-palavras",   label: "Analisador de Texto",    icon: CaseSensitive, emoji: "📝", description: "Conte palavras, caracteres, frases, limites de redes e tempo de leitura.", category: "Utilidades", subcategory: "Texto", color: "#22c55e" },
  { slug: "comparador-textos",   href: "/tools/comparador-textos",   label: "Comparador de Textos",   icon: GitCompare,    emoji: "🔀", description: "Compare dois textos e veja as diferenças por linha.",    category: "Utilidades", subcategory: "Texto", color: "#0ea5e9" },
  { slug: "text-cleaner",        href: "/tools/text-cleaner",        label: "Limpeza de Texto",       icon: Scissors,      emoji: "✂️", description: "Substituição e remoção com regex em tempo real.",        category: "Utilidades", subcategory: "Texto", color: "#10b981" },
  { slug: "texto-para-slug",     href: "/tools/texto-para-slug",     label: "Texto para Slug",        icon: Link2,         emoji: "🔗", description: "Gere slugs amigáveis para URL a partir de texto.",       category: "Utilidades", subcategory: "Texto", color: "#14b8a6" },
  { slug: "formatador-texto",    href: "/tools/formatador-texto",    label: "Formatador de Texto",    icon: CaseUpper,     emoji: "✏️", description: "Transforme texto para MAIÚSCULAS, camelCase, snake_case e outros.",       category: "Utilidades", subcategory: "Texto", color: "#6366f1" },
  { slug: "inversor-texto",      href: "/tools/inversor-texto",      label: "Inversor de Texto",      icon: Repeat2,       emoji: "🔄", description: "Inverta texto por caracteres, palavras ou linhas.",                     category: "Utilidades", subcategory: "Texto", color: "#0ea5e9" },
  { slug: "contador-linhas",     href: "/tools/contador-linhas",     label: "Contador de Linhas",     icon: AlignJustify,  emoji: "📋", description: "Conte total, não-vazias, vazias e linhas únicas de um texto.",           category: "Utilidades", subcategory: "Texto", color: "#14b8a6" },
  { slug: "removedor-acentos",   href: "/tools/removedor-acentos",   label: "Removedor de Acentos",   icon: Eraser,        emoji: "✂️", description: "Remova ã, é, ç, õ e todos os diacríticos do seu texto.",               category: "Utilidades", subcategory: "Texto", color: "#f59e0b" },
  { slug: "ordenador-linhas",    href: "/tools/ordenador-linhas",    label: "Ordenador de Linhas",    icon: ArrowUpDown,   emoji: "↕️", description: "Ordene linhas A→Z, Z→A, por comprimento ou de forma aleatória.",       category: "Utilidades", subcategory: "Texto", color: "#22c55e" },
  { slug: "cifra-cesar",         href: "/tools/cifra-cesar",         label: "Cifra de César",         icon: Lock,          emoji: "🔐", description: "Codifique e decodifique textos com ROT13 ou qualquer deslocamento.",   category: "Utilidades", subcategory: "Texto", color: "#8b5cf6" },
  { slug: "numero-por-extenso",  href: "/tools/numero-por-extenso",  label: "Número por Extenso",     icon: Languages,     emoji: "🔢", description: "Converta números para extenso em português até 999 bilhões.",          category: "Utilidades", subcategory: "Texto", color: "#ec4899" },
  { slug: "texto-para-morse",    href: "/tools/texto-para-morse",    label: "Texto para Morse",       icon: Radio,         emoji: "📡", description: "Converta texto em código Morse e Morse em texto instantaneamente.",  category: "Utilidades", subcategory: "Texto", color: "#f97316" },
  { slug: "contador-vogais",     href: "/tools/contador-vogais",     label: "Frequência de Letras",   icon: BarChart2,     emoji: "🔤", description: "Analise a distribuição de vogais e consoantes no seu texto.",        category: "Utilidades", subcategory: "Texto", color: "#8b5cf6" },
  { slug: "documento-para-markdown", href: "/tools/documento-para-markdown", label: "Documento para Markdown", icon: FileCode2, emoji: "📝", description: "Converta PDF, DOCX, XLS/XLSX e PPTX em Markdown, sem upload.", category: "Utilidades", subcategory: "Texto", color: "#f43f5e" },

  // ── Utilidades · PDF ─────────────────────────────────────────────────────
  { slug: "pdf-extractor",   href: "/tools/pdf-extractor",   label: "Extrator de Docs",       icon: FileText,     emoji: "📄", description: "Extrai texto de PDF e DOCX por página, sem upload.",    category: "Utilidades", subcategory: "PDF", color: "#ef4444" },
  { slug: "pdf-compressor",  href: "/tools/pdf-compressor",  label: "Compressão de PDF",      icon: FileArchive,  emoji: "🗜️", description: "Reduz o tamanho de PDFs em 3 níveis de qualidade.",     category: "Utilidades", subcategory: "PDF", color: "#f97316" },
  { slug: "jpg-para-pdf",    href: "/tools/jpg-para-pdf",    label: "JPG para PDF",           icon: FilePlus2,    emoji: "📄", description: "Junte imagens em um único PDF, ordenando as páginas.",  category: "Utilidades", subcategory: "PDF", color: "#0ea5e9" },
  { slug: "pdf-para-jpg",    href: "/tools/pdf-para-jpg",    label: "PDF para JPG",           icon: FileImage,    emoji: "🖼️", description: "Converta cada página do PDF em imagem JPG ou PNG.",     category: "Utilidades", subcategory: "PDF", color: "#f59e0b" },
  { slug: "unir-pdf",        href: "/tools/unir-pdf",        label: "Unir PDF",               icon: Combine,      emoji: "🔗", description: "Junte vários PDFs em um só, na ordem que quiser.",      category: "Utilidades", subcategory: "PDF", color: "#22c55e" },
  { slug: "dividir-pdf",     href: "/tools/dividir-pdf",     label: "Dividir PDF",            icon: Split,        emoji: "✂️", description: "Extraia intervalos ou separe cada página do PDF.",      category: "Utilidades", subcategory: "PDF", color: "#ec4899" },

  // ── Utilidades · Calculadoras ────────────────────────────────────────────
  { slug: "calculadoras", href: "/tools/calculadoras", label: "Calculadoras", icon: Calculator, emoji: "🧮", description: "Mais de 20 calculadoras (idade, IMC, juros, datas, unidades e mais) em um só lugar, com abas.", category: "Utilidades", subcategory: "Calculadoras", color: "#f97316" },

  // ── Utilidades · Construção ──────────────────────────────────────────────
  { slug: "area-tinta",     href: "/tools/area-tinta",      label: "Área e Tinta",           icon: PaintBucket,  emoji: "🪣", description: "Calcule área de ambientes e quantidade de tinta.",       category: "Utilidades", subcategory: "Construção", color: "#84cc16" },

  // ── Finanças ─────────────────────────────────────────────────────────────
  { slug: "simulador-financiamento", href: "/tools/simulador-financiamento", label: "Simulador de Financiamento",icon: Home,        emoji: "🏠", description: "Simule financiamentos SAC e PRICE com tabela de amortização.",      category: "Finanças", color: "#6366f1" },
  { slug: "salario",                 href: "/tools/salario",                 label: "Salário",                   icon: Wallet,      emoji: "💳", description: "Calcule salário líquido (INSS, IRPF) ou verbas rescisórias.",       category: "Finanças", color: "#22c55e" },
  { slug: "reajuste-aluguel",        href: "/tools/reajuste-aluguel",        label: "Reajuste de Aluguel",       icon: Building2,   emoji: "🏘️", description: "Simule reajuste de aluguel por IGP-M, IPCA, INPC ou percentual.",  category: "Finanças", color: "#0ea5e9" },
  { slug: "calculadora-investimento",href: "/tools/calculadora-investimento",label: "Comparador de Investimentos",icon: BarChart3,  emoji: "📊", description: "Compare CDB, LCI/LCA e Poupança com IR incluído.",                  category: "Finanças", color: "#a855f7" },
  { slug: "calculadora-inss-autonomo",href: "/tools/calculadora-inss-autonomo",label: "INSS Autônomo",           icon: User,       emoji: "🧾", description: "Calcule a contribuição INSS de autônomo/contribuinte individual.",    category: "Finanças", color: "#0ea5e9" },
  { slug: "calculadora-mei",          href: "/tools/calculadora-mei",          label: "Impostos MEI (DAS)",       icon: Store,      emoji: "🏪", description: "Calcule o DAS MEI mensal para comércio, serviços ou ambos.",         category: "Finanças", color: "#22c55e" },
  { slug: "simulador-aposentadoria",  href: "/tools/simulador-aposentadoria",  label: "Simulador Aposentadoria",  icon: Users,      emoji: "👴", description: "Estime quando pode se aposentar e o valor do benefício INSS.",       category: "Finanças", color: "#f97316" },
  { slug: "calculadora-ir-acoes",     href: "/tools/calculadora-ir-acoes",     label: "IR sobre Ações",           icon: Banknote,   emoji: "📊", description: "Calcule IR sobre ganho de capital em ações (15% ou 20%).",           category: "Finanças", color: "#a855f7" },
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
