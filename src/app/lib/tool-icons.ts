import {
  Asterisk, Binary, BracketsCurly, Buildings, Calculator, ChartLineUp, CircleHalf, Code, Crop,
  Eyedropper, FilePdf, FileText, Gradient, Hash,
  IdentificationCard, LockKey, Megaphone, MagnifyingGlass, PaintBrush,
  Palette, Password, PushPin, QrCode, Robot, ShareNetwork,   SquaresFour, Star, Tag, Timer, TextAa, TextAlignJustify, Wallet, Wrench,
  Briefcase, GitDiff, Square,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

/** Ícone (Phosphor) de cada ferramenta; sem emoji. Slug novo sem entrada usa `Square`. */
const TOOL_ICONS: Record<string, Icon> = {
  "color-palette": Palette, "contraste-cores": CircleHalf, gradients: Gradient, "conversor-cores": Eyedropper,
  "formatador-dados": BracketsCurly, codificadores: Binary, "hash-uuid": Hash, "conversores-tecnicos": Calculator, "regex-cron": Asterisk,
  "analisador-texto": TextAa, "editor-texto": TextAlignJustify, "codificacoes-texto": LockKey, "extrator-documentos": FileText, "ferramentas-pdf": FilePdf, "qr-code": QrCode, "geradores": Password, "documentos-br": IdentificationCard, "trabalho-impostos": Briefcase, "imoveis": Buildings, "investimentos": ChartLineUp,
  "grid-layouts": SquaresFour, moodboard: PushPin, "editor-imagem": Crop, "gerador-favicon": Star, "open-graph-preview": ShareNetwork, "robots-generator": Robot,
  "gerador-utm": Tag, "serp-preview": MagnifyingGlass, cronometro: Timer, "comparador-textos": GitDiff,
  calculadoras: Calculator,
};

const CATEGORY_ICONS: Record<string, Icon> = {
  Design: PaintBrush, Dev: Code, Marketing: Megaphone, Utilidades: Wrench, Finanças: Wallet,
};

export const toolIcon = (slug: string): Icon => TOOL_ICONS[slug] ?? Square;
export const categoryIcon = (category: string): Icon => CATEGORY_ICONS[category] ?? Square;
