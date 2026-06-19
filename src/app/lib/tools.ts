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
  { slug: "text-cleaner",    href: "/tools/text-cleaner",    label: "Limpeza de Texto",       icon: Scissors,     emoji: "✂️", description: "Substituição e remoção com regex em tempo real.",        category: "Texto",   color: "#10b981" },
  { slug: "pdf-extractor",   href: "/tools/pdf-extractor",   label: "Extrator de Docs",       icon: FileText,     emoji: "📄", description: "Extrai texto de PDF e DOCX por página, sem upload.",    category: "Texto",   color: "#ef4444" },
  { slug: "pdf-compressor",  href: "/tools/pdf-compressor",  label: "Compressão de PDF",      icon: FileArchive,  emoji: "🗜️", description: "Reduz o tamanho de PDFs em 3 níveis de qualidade.",     category: "Texto",   color: "#f97316" },
  { slug: "image-converter", href: "/tools/image-converter", label: "Conversor de Imagens",   icon: Image,        emoji: "🖼️", description: "PNG, JPG, WebP e BMP com controle de qualidade.",       category: "Imagens", color: "#f59e0b" },
  { slug: "image-upscaler",  href: "/tools/image-upscaler",  label: "Aumentar Resolução",     icon: ZoomIn,       emoji: "🔍", description: "Upscaling 2×, 4× ou 8× por interpolação bicúbica.",     category: "Imagens",    color: "#8b5cf6" },
  { slug: "area-tinta",     href: "/tools/area-tinta",      label: "Área e Tinta",           icon: PaintBucket,  emoji: "🪣", description: "Calcule área de ambientes e quantidade de tinta.",       category: "Construção", color: "#84cc16" },
];

export const CATEGORIES = ["Design", "CSS", "Texto", "Imagens", "Construção"];
