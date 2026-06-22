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
  Type,
  Timer,
  GitCompare,
  ListX,
  Braces,
  BadgeCheck,
  FileDiff,
  Database,
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
  Cake,
  Scale,
  Percent,
  TrendingUp,
  Droplet,
  Pilcrow,
  Thermometer,
  CalendarDays,
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
  Mail,
  Phone,
  AlarmClock,
  Gauge,
  Car,
  Utensils,
  Equal,
  Flame,
  Apple,
  Home,
  Wallet,
  FileCheck,
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
  LineChart,
  Zap,
  Grid3x3,
  Fuel,
  Monitor,
  User,
  Store,
  Users,
  Banknote,
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
  { slug: "color-palette",   href: "/tools/color-palette",   label: "Paleta de Cores",       icon: Palette,      emoji: "🎨", description: "Paletas harmônicas a partir de uma cor base.",           category: "Design",  color: "#ec4899" },
  { slug: "gradients",       href: "/tools/gradients",       label: "Gradientes",             icon: Blend,        emoji: "🌈", description: "Gradientes CSS com animação e múltiplos tipos.",         category: "Design",  color: "#0ea5e9" },
  { slug: "css-units",       href: "/tools/css-units",       label: "Conversor CSS",          icon: Ruler,        emoji: "📐", description: "Converta entre px, rem, em, vw, vh e %.",                category: "CSS",     color: "#6366f1" },

  { slug: "contador-palavras",   href: "/tools/contador-palavras",   label: "Contador de Palavras",   icon: CaseSensitive, emoji: "📝", description: "Conte palavras, caracteres, frases e tempo de leitura.", category: "Texto", color: "#22c55e" },
  { slug: "contador-caracteres", href: "/tools/contador-caracteres", label: "Contador de Caracteres", icon: Type,          emoji: "🔤", description: "Conte caracteres com e sem espaços, com limites.",       category: "Texto", color: "#14b8a6" },
  { slug: "tempo-leitura",       href: "/tools/tempo-leitura",       label: "Tempo de Leitura",       icon: Timer,         emoji: "⏱️", description: "Estime o tempo de leitura e de fala de um texto.",       category: "Texto", color: "#06b6d4" },
  { slug: "comparador-textos",   href: "/tools/comparador-textos",   label: "Comparador de Textos",   icon: GitCompare,    emoji: "🔀", description: "Compare dois textos e veja as diferenças por linha.",    category: "Texto", color: "#0ea5e9" },
  { slug: "removedor-linhas",    href: "/tools/removedor-linhas",    label: "Removedor de Linhas",    icon: ListX,         emoji: "📋", description: "Remova duplicadas, vazias e ordene linhas de texto.",    category: "Texto", color: "#10b981" },
  { slug: "text-cleaner",    href: "/tools/text-cleaner",    label: "Limpeza de Texto",       icon: Scissors,     emoji: "✂️", description: "Substituição e remoção com regex em tempo real.",        category: "Texto",   color: "#10b981" },
  { slug: "pdf-extractor",   href: "/tools/pdf-extractor",   label: "Extrator de Docs",       icon: FileText,     emoji: "📄", description: "Extrai texto de PDF e DOCX por página, sem upload.",    category: "PDF",     color: "#ef4444" },
  { slug: "pdf-compressor",  href: "/tools/pdf-compressor",  label: "Compressão de PDF",      icon: FileArchive,  emoji: "🗜️", description: "Reduz o tamanho de PDFs em 3 níveis de qualidade.",     category: "PDF",     color: "#f97316" },
  { slug: "jpg-para-pdf",    href: "/tools/jpg-para-pdf",    label: "JPG para PDF",           icon: FilePlus2,    emoji: "📄", description: "Junte imagens em um único PDF, ordenando as páginas.",  category: "PDF",     color: "#0ea5e9" },
  { slug: "pdf-para-jpg",    href: "/tools/pdf-para-jpg",    label: "PDF para JPG",           icon: FileImage,    emoji: "🖼️", description: "Converta cada página do PDF em imagem JPG ou PNG.",     category: "PDF",     color: "#f59e0b" },
  { slug: "unir-pdf",        href: "/tools/unir-pdf",        label: "Unir PDF",               icon: Combine,      emoji: "🔗", description: "Junte vários PDFs em um só, na ordem que quiser.",      category: "PDF",     color: "#22c55e" },
  { slug: "dividir-pdf",     href: "/tools/dividir-pdf",     label: "Dividir PDF",            icon: Split,        emoji: "✂️", description: "Extraia intervalos ou separe cada página do PDF.",      category: "PDF",     color: "#ec4899" },

  { slug: "json-formatter",  href: "/tools/json-formatter",  label: "JSON Formatter",         icon: Braces,       emoji: "🧩", description: "Formate e idente JSON com indentação ajustável.",        category: "Dev", color: "#eab308" },
  { slug: "json-validator",  href: "/tools/json-validator",  label: "JSON Validator",         icon: BadgeCheck,   emoji: "✅", description: "Valide JSON e veja o erro com linha e coluna.",          category: "Dev", color: "#22c55e" },
  { slug: "json-diff",       href: "/tools/json-diff",       label: "JSON Diff",              icon: FileDiff,     emoji: "🔍", description: "Compare dois JSON e veja chaves adicionadas e alteradas.", category: "Dev", color: "#0ea5e9" },
  { slug: "sql-formatter",   href: "/tools/sql-formatter",   label: "SQL Formatter",          icon: Database,     emoji: "🗄️", description: "Formate consultas SQL com indentação e palavras-chave.", category: "Dev", color: "#8b5cf6" },
  { slug: "base64-encode",   href: "/tools/base64-encode",   label: "Base64 Encode",          icon: Binary,       emoji: "🔢", description: "Codifique texto e arquivos em Base64 (UTF-8).",          category: "Dev", color: "#6366f1" },
  { slug: "base64-decode",   href: "/tools/base64-decode",   label: "Base64 Decode",          icon: Code,         emoji: "🔣", description: "Decodifique Base64 de volta para texto legível.",        category: "Dev", color: "#3b82f6" },
  { slug: "jwt-decoder",     href: "/tools/jwt-decoder",     label: "JWT Decoder",            icon: KeyRound,     emoji: "🔐", description: "Decodifique header e payload de um token JWT.",          category: "Dev", color: "#ec4899" },
  { slug: "uuid-generator",  href: "/tools/uuid-generator",  label: "Gerador de UUID",        icon: Fingerprint,  emoji: "🆔", description: "Gere UUIDs v4 únicos com um clique.",                    category: "Dev", color: "#f43f5e" },
  { slug: "hash-generator",  href: "/tools/hash-generator",  label: "Gerador de Hash",        icon: Hash,         emoji: "#️⃣", description: "Gere MD5, SHA-1, SHA-256, SHA-384 e SHA-512.",           category: "Dev", color: "#a855f7" },
  { slug: "markdown-para-html", href: "/tools/markdown-para-html", label: "Markdown para HTML", icon: FileCode, emoji: "📝", description: "Converta Markdown em HTML com preview ao vivo.",         category: "Dev", color: "#0ea5e9" },
  { slug: "unix-timestamp",  href: "/tools/unix-timestamp",  label: "Timestamp Unix",         icon: Clock,        emoji: "⏰", description: "Converta timestamp Unix em data e vice-versa.",          category: "Dev", color: "#06b6d4" },

  { slug: "csv-para-json",   href: "/tools/csv-para-json",   label: "CSV para JSON",          icon: ArrowLeftRight, emoji: "🔄", description: "Converta CSV em JSON com delimitador e cabeçalho.",    category: "Dados", color: "#22c55e" },
  { slug: "json-para-csv",   href: "/tools/json-para-csv",   label: "JSON para CSV",          icon: ArrowLeftRight, emoji: "🔄", description: "Converta um array de objetos JSON em CSV.",            category: "Dados", color: "#eab308" },
  { slug: "texto-para-slug", href: "/tools/texto-para-slug", label: "Texto para Slug",        icon: Link2,        emoji: "🔗", description: "Gere slugs amigáveis para URL a partir de texto.",       category: "Texto", color: "#14b8a6" },
  { slug: "lorem-ipsum",     href: "/tools/lorem-ipsum",     label: "Gerador de Lorem Ipsum", icon: Pilcrow,      emoji: "📄", description: "Texto de preenchimento em parágrafos, frases ou palavras.", category: "Texto", color: "#06b6d4" },

  { slug: "conversor-cores", href: "/tools/conversor-cores", label: "Conversor de Cores",     icon: Droplet,      emoji: "🎨", description: "Converta entre HEX, RGB e HSL com prévia ao vivo.",      category: "Design", color: "#a855f7" },

  { slug: "codificador-url", href: "/tools/codificador-url", label: "Codificador de URL",     icon: Link2,        emoji: "🔗", description: "Codifique e decodifique URLs e parâmetros.",            category: "Dev", color: "#0ea5e9" },

  { slug: "open-graph-preview", href: "/tools/open-graph-preview", label: "Open Graph Preview", icon: Share2,  emoji: "🔗", description: "Veja o card de redes sociais e gere meta tags OG.",      category: "SEO", color: "#0ea5e9" },
  { slug: "robots-generator",   href: "/tools/robots-generator",   label: "Gerador de robots.txt", icon: Bot,    emoji: "🤖", description: "Crie robots.txt com Allow, Disallow e Sitemap.",        category: "SEO", color: "#64748b" },
  { slug: "gerador-utm",        href: "/tools/gerador-utm",        label: "Gerador de UTM",        icon: Tag,    emoji: "🔖", description: "Monte URLs de campanha com parâmetros UTM.",          category: "SEO", color: "#f97316" },
  { slug: "serp-preview",       href: "/tools/serp-preview",       label: "SERP Preview",          icon: Search, emoji: "🔎", description: "Simule o resultado do Google com limites de pixel.",   category: "SEO", color: "#22c55e" },

  { slug: "gerador-qr",      href: "/tools/gerador-qr",      label: "Gerador de QR Code",     icon: QrCode,       emoji: "🔳", description: "Crie QR Codes com cores e baixe em PNG ou SVG.",        category: "Utilidades", color: "#6366f1" },
  { slug: "leitor-qr",       href: "/tools/leitor-qr",       label: "Leitor de QR Code",      icon: ScanLine,     emoji: "🔍", description: "Leia QR por imagem ou câmera, sem instalar app.",       category: "Utilidades", color: "#0ea5e9" },
  { slug: "gerador-senha",   href: "/tools/gerador-senha",   label: "Gerador de Senhas",      icon: KeySquare,    emoji: "🔑", description: "Senhas fortes com medidor de força e entropia.",        category: "Utilidades", color: "#f43f5e" },
  { slug: "uuid-massa",      href: "/tools/uuid-massa",      label: "UUID em Massa",          icon: Fingerprint,  emoji: "🆔", description: "Gere até 10.000 UUIDs v4 e baixe em .txt.",             category: "Utilidades", color: "#a855f7" },
  { slug: "sorteador",       href: "/tools/sorteador",       label: "Sorteador",              icon: Dices,        emoji: "🎲", description: "Sorteie nomes ou números, com ou sem repetição.",       category: "Utilidades", color: "#f59e0b" },

  { slug: "image-converter", href: "/tools/image-converter", label: "Conversor de Imagens",   icon: Image,        emoji: "🖼️", description: "PNG, JPG, WebP e BMP com controle de qualidade.",       category: "Imagens", color: "#f59e0b" },
  { slug: "compressor-imagem", href: "/tools/compressor-imagem", label: "Compressor de Imagem", icon: FileArchive, emoji: "🗜️", description: "Reduz o peso de JPG, PNG e WebP por qualidade.",        category: "Imagens", color: "#f97316" },
  { slug: "jpg-para-png",    href: "/tools/jpg-para-png",    label: "JPG para PNG",           icon: FileImage,    emoji: "🖼️", description: "Converta JPG para PNG sem perdas.",                     category: "Imagens", color: "#0ea5e9" },
  { slug: "png-para-jpg",    href: "/tools/png-para-jpg",    label: "PNG para JPG",           icon: FileImage,    emoji: "🖼️", description: "Converta PNG para JPG com controle de qualidade.",      category: "Imagens", color: "#eab308" },
  { slug: "webp-converter",  href: "/tools/webp-converter",  label: "Conversor WebP",         icon: ImagePlus,    emoji: "🖼️", description: "Converta JPG e PNG para WebP com menor peso.",          category: "Imagens", color: "#22c55e" },
  { slug: "redimensionador-imagem", href: "/tools/redimensionador-imagem", label: "Redimensionador", icon: Ruler, emoji: "📐", description: "Altere largura e altura por px ou porcentagem.",        category: "Imagens", color: "#6366f1" },
  { slug: "cortador-imagem", href: "/tools/cortador-imagem", label: "Cortador de Imagem",     icon: Crop,         emoji: "✂️", description: "Recorte com seleção interativa e proporções.",          category: "Imagens", color: "#ec4899" },
  { slug: "gerador-favicon", href: "/tools/gerador-favicon", label: "Gerador de Favicon",     icon: Star,         emoji: "⭐", description: "Gere favicons 16–512px com as tags HTML prontas.",      category: "Imagens", color: "#eab308" },
  { slug: "image-upscaler",  href: "/tools/image-upscaler",  label: "Aumentar Resolução",     icon: ZoomIn,       emoji: "🔍", description: "Upscaling 2×, 4× ou 8× por interpolação bicúbica.",     category: "Imagens",    color: "#8b5cf6" },
  { slug: "area-tinta",     href: "/tools/area-tinta",      label: "Área e Tinta",           icon: PaintBucket,  emoji: "🪣", description: "Calcule área de ambientes e quantidade de tinta.",       category: "Construção", color: "#84cc16" },

  { slug: "calculadora-idade",      href: "/tools/calculadora-idade",      label: "Calculadora de Idade",      icon: Cake,         emoji: "🎂", description: "Idade exata em anos, meses e dias com contagem para o próximo aniversário.",  category: "Calculadoras", color: "#f97316" },
  { slug: "calculadora-imc",        href: "/tools/calculadora-imc",        label: "Calculadora de IMC",        icon: Scale,        emoji: "⚖️", description: "Calcule seu IMC com classificação OMS e faixa de peso ideal.",              category: "Calculadoras", color: "#22c55e" },
  { slug: "calculadora-porcentagem",href: "/tools/calculadora-porcentagem",label: "Calculadora de Porcentagem",icon: Percent,      emoji: "％", description: "Calcule porcentagens, representação e variação percentual entre valores.",    category: "Calculadoras", color: "#eab308" },
  { slug: "calculadora-desconto",   href: "/tools/calculadora-desconto",   label: "Calculadora de Desconto",   icon: Tag,          emoji: "🏷️", description: "Preço final com desconto e valor economizado em segundos.",                 category: "Calculadoras", color: "#ec4899" },
  { slug: "juros-compostos",        href: "/tools/juros-compostos",        label: "Juros Compostos",           icon: TrendingUp,   emoji: "📈", description: "Simule juros compostos com aportes mensais e veja a evolução mês a mês.",   category: "Calculadoras", color: "#6366f1" },
  { slug: "calculadora-datas",      href: "/tools/calculadora-datas",      label: "Calculadora de Datas",      icon: CalendarDays, emoji: "📅", description: "Diferença entre duas datas e soma ou subtração de dias a partir de uma data.", category: "Calculadoras", color: "#0ea5e9" },
  { slug: "conversor-temperatura",  href: "/tools/conversor-temperatura",  label: "Conversor de Temperatura",  icon: Thermometer,  emoji: "🌡️", description: "Converta entre Celsius, Fahrenheit e Kelvin instantaneamente.",             category: "Calculadoras", color: "#f43f5e" },

  // Texto P2 (#46–#52)
  { slug: "formatador-texto",    href: "/tools/formatador-texto",    label: "Formatador de Texto",    icon: CaseUpper,     emoji: "✏️", description: "Transforme texto para MAIÚSCULAS, camelCase, snake_case e outros.",       category: "Texto", color: "#6366f1" },
  { slug: "inversor-texto",      href: "/tools/inversor-texto",      label: "Inversor de Texto",      icon: Repeat2,       emoji: "🔄", description: "Inverta texto por caracteres, palavras ou linhas.",                     category: "Texto", color: "#0ea5e9" },
  { slug: "contador-linhas",     href: "/tools/contador-linhas",     label: "Contador de Linhas",     icon: AlignJustify,  emoji: "📋", description: "Conte total, não-vazias, vazias e linhas únicas de um texto.",           category: "Texto", color: "#14b8a6" },
  { slug: "removedor-acentos",   href: "/tools/removedor-acentos",   label: "Removedor de Acentos",   icon: Eraser,        emoji: "✂️", description: "Remova ã, é, ç, õ e todos os diacríticos do seu texto.",               category: "Texto", color: "#f59e0b" },
  { slug: "ordenador-linhas",    href: "/tools/ordenador-linhas",    label: "Ordenador de Linhas",    icon: ArrowUpDown,   emoji: "↕️", description: "Ordene linhas A→Z, Z→A, por comprimento ou de forma aleatória.",       category: "Texto", color: "#22c55e" },
  { slug: "cifra-cesar",         href: "/tools/cifra-cesar",         label: "Cifra de César",         icon: Lock,          emoji: "🔐", description: "Codifique e decodifique textos com ROT13 ou qualquer deslocamento.",   category: "Texto", color: "#8b5cf6" },
  { slug: "numero-por-extenso",  href: "/tools/numero-por-extenso",  label: "Número por Extenso",     icon: Languages,     emoji: "🔢", description: "Converta números para extenso em português até 999 bilhões.",          category: "Texto", color: "#ec4899" },

  // Dev P2 (#53–#57)
  { slug: "regex-tester",        href: "/tools/regex-tester",        label: "Testador de Regex",      icon: FlaskConical,  emoji: "🔎", description: "Teste expressões regulares em tempo real com highlight de matches.",  category: "Dev", color: "#f97316" },
  { slug: "html-formatter",      href: "/tools/html-formatter",      label: "HTML Formatter",         icon: Code2,         emoji: "🖋️", description: "Formate e indente HTML minificado instantaneamente.",                 category: "Dev", color: "#0ea5e9" },
  { slug: "css-minifier",        href: "/tools/css-minifier",        label: "Minificador de CSS",     icon: Minimize2,     emoji: "🗜️", description: "Minifique CSS removendo comentários e espaços desnecessários.",      category: "Dev", color: "#6366f1" },
  { slug: "conversor-bases",     href: "/tools/conversor-bases",     label: "Conversor de Bases",     icon: Calculator,    emoji: "🔢", description: "Converta entre decimal, binário, octal e hexadecimal.",              category: "Dev", color: "#22c55e" },
  { slug: "tabela-ascii",        href: "/tools/tabela-ascii",        label: "Tabela ASCII",           icon: Table,         emoji: "🔣", description: "Tabela ASCII 0–255 com decimal, hex, binário e caractere.",           category: "Dev", color: "#a855f7" },

  // Utilidades BR P2 (#58–#63)
  { slug: "gerador-cpf",         href: "/tools/gerador-cpf",         label: "Gerador de CPF",         icon: IdCard,        emoji: "🪪", description: "Gere CPFs válidos para testes — dígitos verificadores corretos.",     category: "Utilidades BR", color: "#6366f1" },
  { slug: "validador-cpf",       href: "/tools/validador-cpf",       label: "Validador de CPF",       icon: ShieldCheck,   emoji: "✅", description: "Valide CPF pelos dígitos verificadores da Receita Federal.",          category: "Utilidades BR", color: "#22c55e" },
  { slug: "gerador-cnpj",        href: "/tools/gerador-cnpj",        label: "Gerador de CNPJ",        icon: Building2,     emoji: "🏢", description: "Gere CNPJs válidos para testes — sem empresa real associada.",        category: "Utilidades BR", color: "#f97316" },
  { slug: "validador-cnpj",      href: "/tools/validador-cnpj",      label: "Validador de CNPJ",      icon: ShieldCheck,   emoji: "✅", description: "Valide CNPJ pelos dígitos verificadores da Receita Federal.",         category: "Utilidades BR", color: "#0ea5e9" },
  { slug: "validador-email",     href: "/tools/validador-email",     label: "Validador de E-mail",    icon: Mail,          emoji: "📧", description: "Valide e-mail com checklist: @, domínio, TLD e caracteres.",          category: "Utilidades BR", color: "#ec4899" },
  { slug: "formatador-telefone", href: "/tools/formatador-telefone", label: "Formatador de Telefone", icon: Phone,         emoji: "📱", description: "Formate telefones brasileiros (XX) XXXXX-XXXX. Detecta celular e fixo.", category: "Utilidades BR", color: "#14b8a6" },

  // Calculadoras P2 (#64–#70)
  { slug: "calculadora-horas",       href: "/tools/calculadora-horas",       label: "Calculadora de Horas",      icon: AlarmClock,  emoji: "⏱️", description: "Some e subtraia horas e minutos no formato HH:MM.",                  category: "Calculadoras", color: "#6366f1" },
  { slug: "conversor-unidades",      href: "/tools/conversor-unidades",      label: "Conversor de Unidades",     icon: Gauge,       emoji: "📏", description: "Converta comprimento, peso, volume, área e velocidade.",             category: "Calculadoras", color: "#22c55e" },
  { slug: "calculadora-combustivel", href: "/tools/calculadora-combustivel", label: "Calculadora de Combustível",icon: Car,         emoji: "⛽", description: "Calcule litros e custo de uma viagem por distância e consumo.",     category: "Calculadoras", color: "#f59e0b" },
  { slug: "calculadora-gorjeta",     href: "/tools/calculadora-gorjeta",     label: "Calculadora de Gorjeta",    icon: Utensils,    emoji: "🍽️", description: "Calcule gorjeta e divisão da conta por pessoa.",                   category: "Calculadoras", color: "#0ea5e9" },
  { slug: "regra-de-tres",           href: "/tools/regra-de-tres",           label: "Regra de Três",             icon: Equal,       emoji: "⚖️", description: "Calcule proporção direta e inversa — encontre X instantaneamente.", category: "Calculadoras", color: "#a855f7" },
  { slug: "calculadora-calorias",    href: "/tools/calculadora-calorias",    label: "Calculadora de Calorias",   icon: Flame,       emoji: "🔥", description: "Calcule TMB e TDEE pela fórmula Mifflin-St Jeor.",                 category: "Calculadoras", color: "#ef4444" },
  { slug: "calculadora-macros",      href: "/tools/calculadora-macros",      label: "Calculadora de Macros",     icon: Apple,       emoji: "🥗", description: "Distribua proteína, carbo e gordura em gramas por meta calórica.",  category: "Calculadoras", color: "#22c55e" },

  // Finanças P2 (#71–#75)
  { slug: "simulador-financiamento", href: "/tools/simulador-financiamento", label: "Simulador de Financiamento",icon: Home,        emoji: "🏠", description: "Simule financiamentos SAC e PRICE com tabela de amortização.",      category: "Finanças", color: "#6366f1" },
  { slug: "calculadora-salario",     href: "/tools/calculadora-salario",     label: "Calculadora de Salário",    icon: Wallet,      emoji: "💳", description: "Calcule salário líquido 2026 com INSS e IRPF progressivos.",        category: "Finanças", color: "#22c55e" },
  { slug: "calculadora-rescisao",    href: "/tools/calculadora-rescisao",    label: "Calculadora de Rescisão",   icon: FileCheck,   emoji: "📋", description: "Calcule verbas rescisórias: férias, 13°, FGTS e multa de 40%.",    category: "Finanças", color: "#f97316" },
  { slug: "reajuste-aluguel",        href: "/tools/reajuste-aluguel",        label: "Reajuste de Aluguel",       icon: Building2,   emoji: "🏘️", description: "Simule reajuste de aluguel por IGP-M, IPCA, INPC ou percentual.",  category: "Finanças", color: "#0ea5e9" },
  { slug: "calculadora-investimento",href: "/tools/calculadora-investimento",label: "Comparador de Investimentos",icon: BarChart3,  emoji: "📊", description: "Compare CDB, LCI/LCA e Poupança com IR incluído.",                  category: "Finanças", color: "#a855f7" },

  // Texto P3 (#76–#78)
  { slug: "texto-para-morse",   href: "/tools/texto-para-morse",   label: "Texto para Morse",          icon: Radio,       emoji: "📡", description: "Converta texto em código Morse e Morse em texto instantaneamente.",  category: "Texto", color: "#f97316" },
  { slug: "contador-vogais",    href: "/tools/contador-vogais",    label: "Frequência de Letras",      icon: BarChart2,   emoji: "🔤", description: "Analise a distribuição de vogais e consoantes no seu texto.",        category: "Texto", color: "#8b5cf6" },
  { slug: "gerador-anagrama",   href: "/tools/gerador-anagrama",   label: "Gerador de Anagramas",      icon: Shuffle,     emoji: "🔀", description: "Embaralhe letras de palavras ou frases para criar anagramas.",       category: "Texto", color: "#0ea5e9" },

  // Dev P3 (#79–#83)
  { slug: "json-minifier",      href: "/tools/json-minifier",      label: "Minificador de JSON",       icon: Minimize2,   emoji: "🗜️", description: "Compacte JSON removendo espaços para produção.",                    category: "Dev", color: "#eab308" },
  { slug: "url-parser",         href: "/tools/url-parser",         label: "Parser de URL",             icon: Globe,       emoji: "🔗", description: "Decomponha URLs em protocolo, host, path, query e parâmetros.",     category: "Dev", color: "#14b8a6" },
  { slug: "xml-formatter",      href: "/tools/xml-formatter",      label: "XML Formatter",             icon: Code2,       emoji: "📋", description: "Formate, indente ou minifique XML com validação automática.",       category: "Dev", color: "#f43f5e" },
  { slug: "cron-helper",        href: "/tools/cron-helper",        label: "Leitor de Cron",            icon: Settings,    emoji: "⏱️", description: "Traduza expressões cron para português e veja as próximas execuções.", category: "Dev", color: "#6366f1" },
  { slug: "color-generator",    href: "/tools/color-generator",    label: "Gerador de Paleta",         icon: Palette,     emoji: "🎨", description: "Gere paletas de cores harmônicas com HEX, RGB e HSL.",             category: "Design", color: "#a855f7" },

  // Imagens P3 (#84–#85)
  { slug: "image-to-base64",    href: "/tools/image-to-base64",    label: "Imagem para Base64",        icon: FileDown,    emoji: "🖼️", description: "Converta imagens para Base64 (data URI) e Base64 de volta.",        category: "Imagens", color: "#0ea5e9" },
  { slug: "extrator-cores",     href: "/tools/extrator-cores",     label: "Extrator de Cores",         icon: Pipette,     emoji: "🌈", description: "Extraia as cores dominantes de qualquer imagem como paleta.",       category: "Imagens", color: "#ec4899" },

  // Utilidades P3 (#86–#88)
  { slug: "gerador-cartao",     href: "/tools/gerador-cartao",     label: "Gerador de Cartão",         icon: CreditCard,  emoji: "💳", description: "Gere números de cartão de crédito válidos pelo algoritmo Luhn.",   category: "Utilidades", color: "#6366f1" },
  { slug: "validador-luhn",     href: "/tools/validador-luhn",     label: "Validador Luhn",            icon: ShieldCheck, emoji: "🔍", description: "Valide cartões de crédito pelo algoritmo Luhn e detecte bandeira.", category: "Utilidades", color: "#22c55e" },
  { slug: "cronometro",         href: "/tools/cronometro",         label: "Cronômetro Online",         icon: StopCircle,  emoji: "⏱️", description: "Cronômetro com laps e timer regressivo — direto no navegador.",    category: "Utilidades", color: "#f97316" },

  // Calculadoras P3 (#89–#94)
  { slug: "juros-simples",            href: "/tools/juros-simples",            label: "Juros Simples",            icon: LineChart,  emoji: "📈", description: "Calcule montante e juros com a fórmula M = P(1 + i·n).",              category: "Calculadoras", color: "#0ea5e9" },
  { slug: "calculadora-energia",      href: "/tools/calculadora-energia",      label: "Energia Elétrica",         icon: Zap,        emoji: "⚡", description: "Calcule o consumo em kWh e o custo na conta de luz por aparelho.",    category: "Calculadoras", color: "#eab308" },
  { slug: "calculadora-metro-quadrado",href: "/tools/calculadora-metro-quadrado",label: "Custo por m²",          icon: Grid3x3,    emoji: "📐", description: "Calcule caixas de piso ou litros de tinta com desperdício incluso.",   category: "Calculadoras", color: "#10b981" },
  { slug: "gasolina-vs-alcool",       href: "/tools/gasolina-vs-alcool",       label: "Gasolina vs Álcool",       icon: Fuel,       emoji: "⛽", description: "Descubra qual combustível compensa com a regra dos 70%.",             category: "Calculadoras", color: "#f97316" },
  { slug: "calculadora-tela",         href: "/tools/calculadora-tela",         label: "Calculadora de Tela",      icon: Monitor,    emoji: "🖥️", description: "Calcule PPI, proporção e dimensões físicas de telas e monitores.",    category: "Calculadoras", color: "#6366f1" },
  { slug: "conversor-tempo",          href: "/tools/conversor-tempo",          label: "Conversor de Tempo",       icon: Clock,      emoji: "🕐", description: "Converta entre segundos, minutos, horas, dias, semanas e anos.",      category: "Calculadoras", color: "#8b5cf6" },

  // Finanças P3 (#95–#98)
  { slug: "calculadora-inss-autonomo",href: "/tools/calculadora-inss-autonomo",label: "INSS Autônomo",           icon: User,       emoji: "🧾", description: "Calcule a contribuição INSS de autônomo/contribuinte individual.",    category: "Finanças", color: "#0ea5e9" },
  { slug: "calculadora-mei",          href: "/tools/calculadora-mei",          label: "Impostos MEI (DAS)",       icon: Store,      emoji: "🏪", description: "Calcule o DAS MEI mensal para comércio, serviços ou ambos.",         category: "Finanças", color: "#22c55e" },
  { slug: "simulador-aposentadoria",  href: "/tools/simulador-aposentadoria",  label: "Simulador Aposentadoria",  icon: Users,      emoji: "👴", description: "Estime quando pode se aposentar e o valor do benefício INSS.",       category: "Finanças", color: "#f97316" },
  { slug: "calculadora-ir-acoes",     href: "/tools/calculadora-ir-acoes",     label: "IR sobre Ações",           icon: Banknote,   emoji: "📊", description: "Calcule IR sobre ganho de capital em ações (15% ou 20%).",           category: "Finanças", color: "#a855f7" },
];

export const CATEGORIES = ["Design", "CSS", "Texto", "Dev", "Dados", "SEO", "Imagens", "PDF", "Utilidades", "Construção", "Calculadoras", "Utilidades BR", "Finanças"];
