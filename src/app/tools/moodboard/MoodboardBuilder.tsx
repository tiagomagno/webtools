"use client";

import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Palette as PaletteIcon, Smartphone, Monitor, Download, Trash2, X, ImagePlus, Images, RotateCcw } from "lucide-react";
import { downloadUrl } from "../../lib/image-tools";

// ─── Tipos ────────────────────────────────────────────────────────────────

type ProjectType = "branding" | "mobile" | "website";
type Align = "left" | "center" | "right";
type VAlign = "start" | "center" | "end";

interface BaseElement {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  /** Papel do elemento no modelo (ex: "logo-bg", "cta-text"). Usado para
   *  automatizar upload de logo/telas e aplicação de paleta de cores. */
  role?: string;
}
interface ImageElement extends BaseElement {
  type: "image";
  src: string;
}
interface ColorElement extends BaseElement {
  type: "color";
  hex: string;
}
interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  weight: number;
  color: string;
  align: Align;
  /** Alinhamento vertical dentro da caixa (a caixa cobre o cartão inteiro
   *  para que clicar em qualquer parte do cartão selecione o texto). */
  valign?: VAlign;
  /** Respiro interno em px entre a borda do cartão e o texto. */
  pad?: number;
}
type MoodboardElement = ImageElement | ColorElement | TextElement;

// ─── Constantes ───────────────────────────────────────────────────────────

const CANVAS_PRESETS: Record<ProjectType, { w: number; h: number }> = {
  branding: { w: 1200, h: 900 },
  mobile: { w: 800, h: 1400 },
  website: { w: 1400, h: 900 },
};

const PROJECT_META: Record<ProjectType, { label: string; icon: typeof PaletteIcon; hint: string }> = {
  branding: { label: "Branding", icon: PaletteIcon, hint: "Logo, paleta, tipografia e textura da marca." },
  mobile: { label: "App Mobile", icon: Smartphone, hint: "Logo do app, telas de referência e paleta." },
  website: { label: "Website", icon: Monitor, hint: "Logo, prints do site, paleta e tipografia." },
};

const FONTS = [
  { label: "Sistema (Sans)", value: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
  { label: "Georgia (Serif)", value: 'Georgia, "Times New Roman", serif' },
  { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { label: "Courier (Mono)", value: '"Courier New", Courier, monospace' },
  { label: "Trebuchet MS", value: '"Trebuchet MS", sans-serif' },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Impact", value: "Impact, Haettenschweiler, sans-serif" },
  { label: "Arial Black", value: '"Arial Black", Gadget, sans-serif' },
];
const SANS = FONTS[0].value;

// ─── Modelos (bento-grid) por tipo de projeto ──────────────────────────────
//
// Cada bloco de texto cobre EXATAMENTE a mesma área do seu cartão de cor
// ("-bg"/"-text" do mesmo papel), para que clicar em qualquer ponto do
// cartão selecione o texto (não a cor por baixo). `valign`/`pad` controlam
// onde o texto aparece dentro dessa área. Ao enviar uma logo, o bloco
// "logo-bg" vira imagem e a paleta extraída é aplicada nos papéis listados
// em `paletteRoles`. Ao enviar telas (mobile/website), os blocos
// "screenN-bg" viram imagem.

function paletteSwatchSpecs(x: number, y: number, size: number, gap: number, count = 5): Array<Omit<MoodboardElement, "id" | "z">> {
  return Array.from({ length: count }, (_, i) => ({
    type: "color" as const,
    role: "palette-swatch",
    hex: "#78716c",
    x: x + i * (size + gap),
    y,
    w: size,
    h: size,
  }));
}

function buildBrandingTemplateSpecs(): Array<Omit<MoodboardElement, "id" | "z">> {
  return [
    // Logo
    { type: "color", role: "logo-bg", hex: "#1c1917", x: 30, y: 30, w: 460, h: 272 },
    { type: "text", role: "logo-text", content: "SUA MARCA", fontFamily: SANS, fontSize: 52, weight: 800, color: "#ffffff", align: "left", valign: "center", pad: 24, x: 30, y: 30, w: 460, h: 272 },
    // Link / handle
    { type: "color", role: "accent-bg", hex: "#57534e", x: 513, y: 30, w: 178, h: 272 },
    { type: "text", role: "accent-text", content: "seusite.com/app", fontFamily: SANS, fontSize: 16, weight: 600, color: "#ffffff", align: "center", valign: "center", pad: 14, x: 513, y: 30, w: 178, h: 272 },
    // Imagem / produto em destaque
    { type: "color", role: "hero-bg", hex: "#292524", x: 716, y: 30, w: 453, h: 458 },
    { type: "text", role: "hero-text", content: "Seu diferencial\nem uma frase", fontFamily: SANS, fontSize: 32, weight: 700, color: "#ffffff", align: "left", valign: "end", pad: 28, x: 716, y: 30, w: 453, h: 458 },
    // Mockup do app
    { type: "color", role: "mockup-bg", hex: "#44403c", x: 30, y: 325, w: 377, h: 545 },
    { type: "text", role: "mockup-text", content: "Mockup do app", fontFamily: SANS, fontSize: 22, weight: 600, color: "#ffffff", align: "center", valign: "end", pad: 20, x: 30, y: 325, w: 377, h: 545 },
    // Foto / lifestyle
    { type: "color", role: "photo-bg", hex: "#78716c", x: 431, y: 325, w: 260, h: 275 },
    { type: "text", role: "photo-text", content: "Foto / lifestyle", fontFamily: SANS, fontSize: 18, weight: 600, color: "#ffffff", align: "center", valign: "end", pad: 16, x: 431, y: 325, w: 260, h: 275 },
    // Tipografia + paleta (texto e swatches livres, sem cartão)
    { type: "text", role: "typography-text", content: "Tipografia\nNome da fonte", fontFamily: SANS, fontSize: 15, weight: 600, color: "#d6d3d1", align: "left", x: 431, y: 608, w: 260, h: 34 },
    ...paletteSwatchSpecs(431, 650, 36, 8),
    // Chamada para ação
    { type: "color", role: "cta-bg", hex: "#a8a29e", x: 431, y: 694, w: 260, h: 175 },
    { type: "text", role: "cta-text", content: "Chamada para ação (CTA)", fontFamily: SANS, fontSize: 18, weight: 700, color: "#1c1917", align: "center", valign: "center", pad: 16, x: 431, y: 694, w: 260, h: 175 },
    // Mensagem de destaque
    { type: "color", role: "message-bg", hex: "#fafaf9", x: 716, y: 512, w: 453, h: 357 },
    { type: "text", role: "message-text", content: "Sua proposta de valor\nem destaque", fontFamily: SANS, fontSize: 28, weight: 800, color: "#111111", align: "left", pad: 24, x: 716, y: 512, w: 453, h: 214 },
    { type: "text", role: "message-sub", content: "Subtítulo de apoio para reforçar a mensagem.", fontFamily: SANS, fontSize: 14, weight: 400, color: "#57534e", align: "left", pad: 24, x: 716, y: 726, w: 453, h: 143 },
  ] as Array<Omit<MoodboardElement, "id" | "z">>;
}

function buildMobileTemplateSpecs(): Array<Omit<MoodboardElement, "id" | "z">> {
  return [
    // Logo do app
    { type: "color", role: "logo-bg", hex: "#1c1917", x: 40, y: 40, w: 720, h: 140 },
    { type: "text", role: "logo-text", content: "SEU APP", fontFamily: SANS, fontSize: 42, weight: 800, color: "#ffffff", align: "left", valign: "center", pad: 24, x: 40, y: 40, w: 720, h: 140 },
    // Telas do app (upload)
    { type: "color", role: "screen1-bg", hex: "#44403c", x: 40, y: 210, w: 340, h: 560 },
    { type: "text", role: "screen1-text", content: "Tela 1\ndo app", fontFamily: SANS, fontSize: 20, weight: 600, color: "#ffffff", align: "center", valign: "end", pad: 24, x: 40, y: 210, w: 340, h: 560 },
    { type: "color", role: "screen2-bg", hex: "#292524", x: 420, y: 210, w: 340, h: 560 },
    { type: "text", role: "screen2-text", content: "Tela 2\ndo app", fontFamily: SANS, fontSize: 20, weight: 600, color: "#ffffff", align: "center", valign: "end", pad: 24, x: 420, y: 210, w: 340, h: 560 },
    // Ícone / destaque + CTA
    { type: "color", role: "accent-bg", hex: "#78716c", x: 40, y: 800, w: 340, h: 130 },
    { type: "text", role: "accent-text", content: "Ícone / destaque", fontFamily: SANS, fontSize: 16, weight: 600, color: "#ffffff", align: "center", valign: "center", pad: 14, x: 40, y: 800, w: 340, h: 130 },
    { type: "color", role: "cta-bg", hex: "#a8a29e", x: 420, y: 800, w: 340, h: 130 },
    { type: "text", role: "cta-text", content: "Baixe agora (CTA)", fontFamily: SANS, fontSize: 17, weight: 700, color: "#1c1917", align: "center", valign: "center", pad: 14, x: 420, y: 800, w: 340, h: 130 },
    // Tipografia + paleta
    { type: "text", role: "typography-text", content: "Tipografia\nNome da fonte", fontFamily: SANS, fontSize: 15, weight: 600, color: "#d6d3d1", align: "left", x: 40, y: 960, w: 340, h: 55 },
    ...paletteSwatchSpecs(420, 960, 56, 10),
    // Mensagem de destaque
    { type: "color", role: "message-bg", hex: "#fafaf9", x: 40, y: 1050, w: 720, h: 310 },
    { type: "text", role: "message-text", content: "Sua proposta de valor\nem destaque", fontFamily: SANS, fontSize: 30, weight: 800, color: "#111111", align: "left", pad: 28, x: 40, y: 1050, w: 720, h: 186 },
    { type: "text", role: "message-sub", content: "Subtítulo de apoio para reforçar a mensagem.", fontFamily: SANS, fontSize: 15, weight: 400, color: "#57534e", align: "left", pad: 28, x: 40, y: 1236, w: 720, h: 124 },
  ] as Array<Omit<MoodboardElement, "id" | "z">>;
}

function buildWebsiteTemplateSpecs(): Array<Omit<MoodboardElement, "id" | "z">> {
  return [
    // Logo
    { type: "color", role: "logo-bg", hex: "#1c1917", x: 30, y: 30, w: 460, h: 272 },
    { type: "text", role: "logo-text", content: "SEU SITE", fontFamily: SANS, fontSize: 52, weight: 800, color: "#ffffff", align: "left", valign: "center", pad: 24, x: 30, y: 30, w: 460, h: 272 },
    // Link
    { type: "color", role: "accent-bg", hex: "#57534e", x: 513, y: 30, w: 178, h: 272 },
    { type: "text", role: "accent-text", content: "seusite.com", fontFamily: SANS, fontSize: 16, weight: 600, color: "#ffffff", align: "center", valign: "center", pad: 14, x: 513, y: 30, w: 178, h: 272 },
    // Prints do site (upload)
    { type: "color", role: "screen1-bg", hex: "#292524", x: 716, y: 30, w: 653, h: 458 },
    { type: "text", role: "screen1-text", content: "Print do site\n(home)", fontFamily: SANS, fontSize: 30, weight: 700, color: "#ffffff", align: "left", valign: "end", pad: 28, x: 716, y: 30, w: 653, h: 458 },
    { type: "color", role: "screen2-bg", hex: "#44403c", x: 30, y: 325, w: 377, h: 545 },
    { type: "text", role: "screen2-text", content: "Print do site\n(página interna)", fontFamily: SANS, fontSize: 20, weight: 600, color: "#ffffff", align: "center", valign: "end", pad: 20, x: 30, y: 325, w: 377, h: 545 },
    // Foto / lifestyle
    { type: "color", role: "photo-bg", hex: "#78716c", x: 431, y: 325, w: 260, h: 275 },
    { type: "text", role: "photo-text", content: "Foto / lifestyle", fontFamily: SANS, fontSize: 18, weight: 600, color: "#ffffff", align: "center", valign: "end", pad: 16, x: 431, y: 325, w: 260, h: 275 },
    // Tipografia + paleta
    { type: "text", role: "typography-text", content: "Tipografia\nNome da fonte", fontFamily: SANS, fontSize: 15, weight: 600, color: "#d6d3d1", align: "left", x: 431, y: 608, w: 260, h: 34 },
    ...paletteSwatchSpecs(431, 650, 36, 8),
    // Chamada para ação
    { type: "color", role: "cta-bg", hex: "#a8a29e", x: 431, y: 694, w: 260, h: 175 },
    { type: "text", role: "cta-text", content: "Chamada para ação (CTA)", fontFamily: SANS, fontSize: 18, weight: 700, color: "#1c1917", align: "center", valign: "center", pad: 16, x: 431, y: 694, w: 260, h: 175 },
    // Mensagem de destaque
    { type: "color", role: "message-bg", hex: "#fafaf9", x: 716, y: 512, w: 653, h: 357 },
    { type: "text", role: "message-text", content: "Sua proposta de valor\nem destaque", fontFamily: SANS, fontSize: 28, weight: 800, color: "#111111", align: "left", pad: 24, x: 716, y: 512, w: 653, h: 214 },
    { type: "text", role: "message-sub", content: "Subtítulo de apoio para reforçar a mensagem.", fontFamily: SANS, fontSize: 14, weight: 400, color: "#57534e", align: "left", pad: 24, x: 716, y: 726, w: 653, h: 143 },
  ] as Array<Omit<MoodboardElement, "id" | "z">>;
}

interface TemplateConfig {
  bg: string;
  build: () => Array<Omit<MoodboardElement, "id" | "z">>;
  logoBgRole: string;
  logoTextRole: string;
  screenRoles: string[];
  screenLabel: string;
  paletteRoles: string[];
}

const TEMPLATE_CONFIG: Record<ProjectType, TemplateConfig> = {
  branding: {
    bg: "#111111",
    build: buildBrandingTemplateSpecs,
    logoBgRole: "logo-bg",
    logoTextRole: "logo-text",
    screenRoles: [],
    screenLabel: "",
    paletteRoles: ["hero-bg", "mockup-bg", "photo-bg", "cta-bg", "accent-bg"],
  },
  mobile: {
    bg: "#111111",
    build: buildMobileTemplateSpecs,
    logoBgRole: "logo-bg",
    logoTextRole: "logo-text",
    screenRoles: ["screen1-bg", "screen2-bg"],
    screenLabel: "telas do app",
    paletteRoles: ["accent-bg", "cta-bg"],
  },
  website: {
    bg: "#111111",
    build: buildWebsiteTemplateSpecs,
    logoBgRole: "logo-bg",
    logoTextRole: "logo-text",
    screenRoles: ["screen1-bg", "screen2-bg"],
    screenLabel: "prints do site",
    paletteRoles: ["photo-bg", "accent-bg", "cta-bg"],
  },
};

// ─── Utilitários ──────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function bestTextColor(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) || 0;
  const g = parseInt(h.substring(2, 4), 16) || 0;
  const b = parseInt(h.substring(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 >= 150 ? "#111111" : "#ffffff";
}

function loadImageAsync(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao carregar imagem"));
    img.src = src;
  });
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

/** Extrai as cores dominantes de uma imagem (ex: logo), ignorando a cor de
 *  fundo amostrada nos 4 cantos — evita que o branco/transparente do fundo
 *  de uma logo domine a paleta. */
function extractPalette(src: string, count = 5): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const size = 120;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas indisponível.")); return; }
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);

      const bucketKey = (i: number) => {
        const r = Math.round(data[i] / 24) * 24;
        const g = Math.round(data[i + 1] / 24) * 24;
        const b = Math.round(data[i + 2] / 24) * 24;
        return `${r},${g},${b}`;
      };
      const corners = [0, (size - 1) * 4, (size - 1) * size * 4, ((size - 1) * size + size - 1) * 4];
      const bgKeys = new Set(corners.map(bucketKey));

      const count_ = (skipBg: boolean) => {
        const bucket: Record<string, number> = {};
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 200) continue;
          const key = bucketKey(i);
          if (skipBg && bgKeys.has(key)) continue;
          bucket[key] = (bucket[key] ?? 0) + 1;
        }
        return bucket;
      };

      let bucket = count_(true);
      if (Object.keys(bucket).length === 0) bucket = count_(false);

      const entries = Object.entries(bucket).sort((a, b) => b[1] - a[1]);
      const hexes = entries.slice(0, count).map(([key]) => {
        const [r, g, b] = key.split(",").map(Number);
        return rgbToHex(r, g, b);
      });
      resolve(hexes.length ? hexes : ["#6b7280"]);
    };
    img.onerror = () => reject(new Error("Falha ao carregar imagem para extrair cores."));
    img.src = src;
  });
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const para of paragraphs) {
    const words = para.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(test).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    lines.push(line);
  }
  return lines;
}

function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, h: number, lineHeight: number, valign?: VAlign) {
  const lines = wrapLines(ctx, text, w);
  const totalH = lines.length * lineHeight;
  let startY = y;
  if (valign === "center") startY = y + Math.max(0, (h - totalH) / 2);
  else if (valign === "end") startY = y + Math.max(0, h - totalH);
  lines.forEach((line, i) => ctx.fillText(line, x, startY + i * lineHeight));
}

function buildAllTemplates() {
  let id = 0;
  let z = 0;
  const nid = () => `el-${++id}`;
  const nz = () => ++z;
  const withIds = (specs: Array<Omit<MoodboardElement, "id" | "z">>) => specs.map((s) => ({ ...s, id: nid(), z: nz() }) as MoodboardElement);
  return {
    boards: {
      branding: withIds(buildBrandingTemplateSpecs()),
      mobile: withIds(buildMobileTemplateSpecs()),
      website: withIds(buildWebsiteTemplateSpecs()),
    } as Record<ProjectType, MoodboardElement[]>,
    lastId: id,
    lastZ: z,
  };
}

// ─── Estilos compartilhados ───────────────────────────────────────────────

const panelStyle: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 14, marginBottom: 6, display: "block" };
const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, boxSizing: "border-box" };
const colorInputBoxStyle: React.CSSProperties = { width: "100%", height: 34, borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", padding: 2, background: "none" };

function toggleBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1, fontSize: 12, fontWeight: 600, padding: "6px 8px", borderRadius: 7, cursor: "pointer",
    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    background: active ? "var(--accent)" : "var(--surface-2)",
    color: active ? "#fff" : "var(--text-muted)",
  };
}

function smallBtnStyle(danger = false): React.CSSProperties {
  return {
    flex: 1, fontSize: 12, fontWeight: 600, padding: "7px 8px", borderRadius: 7, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
    border: `1px solid ${danger ? "#ef444444" : "var(--border)"}`,
    background: "var(--surface-2)",
    color: danger ? "#ef4444" : "var(--text)",
  };
}

const toolbarBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, padding: "8px 14px", borderRadius: 8, cursor: "pointer",
  border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)",
};

// ─── Componente principal ─────────────────────────────────────────────────

export default function MoodboardBuilder() {
  const [projectType, setProjectType] = useState<ProjectType>("branding");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [exporting, setExporting] = useState(false);

  // Cada tipo de projeto mantém seu próprio board — trocar de aba não
  // descarta o trabalho já feito em Branding/Mobile/Website.
  const initRef = useRef<ReturnType<typeof buildAllTemplates> | null>(null);
  if (!initRef.current) initRef.current = buildAllTemplates();
  const init = initRef.current;

  const [boards, setBoardsState] = useState<Record<ProjectType, MoodboardElement[]>>(() => init.boards);
  const [bgColors, setBgColorsState] = useState<Record<ProjectType, string>>(() => ({
    branding: TEMPLATE_CONFIG.branding.bg,
    mobile: TEMPLATE_CONFIG.mobile.bg,
    website: TEMPLATE_CONFIG.website.bg,
  }));

  const elements = boards[projectType];
  const bgColor = bgColors[projectType];
  const cfg = TEMPLATE_CONFIG[projectType];
  const { w: canvasW, h: canvasH } = CANVAS_PRESETS[projectType];

  const wrapRef = useRef<HTMLDivElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetId = useRef<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const screensInputRef = useRef<HTMLInputElement>(null);

  const idCounter = useRef(init.lastId);
  const zCounter = useRef(init.lastZ);
  const uid = () => `el-${++idCounter.current}`;
  const nextZ = () => ++zCounter.current;

  const actionRef = useRef<{ id: string; mode: "move" | "resize"; startClientX: number; startClientY: number; start: { x: number; y: number; w: number; h: number } } | null>(null);

  function setElements(updater: MoodboardElement[] | ((prev: MoodboardElement[]) => MoodboardElement[])) {
    setBoardsState((prev) => {
      const current = prev[projectType];
      const next = typeof updater === "function" ? (updater as (p: MoodboardElement[]) => MoodboardElement[])(current) : updater;
      return { ...prev, [projectType]: next };
    });
  }

  function setBgColor(hex: string) {
    setBgColorsState((prev) => ({ ...prev, [projectType]: hex }));
  }

  // Ajusta a escala do stage ao container disponível.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(Math.min(1.3, w / canvasW));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasW]);

  // Arrastar / redimensionar elementos.
  useEffect(() => {
    function move(e: PointerEvent) {
      const a = actionRef.current;
      if (!a) return;
      const dx = (e.clientX - a.startClientX) / scale;
      const dy = (e.clientY - a.startClientY) / scale;
      if (a.mode === "move") {
        updateElement(a.id, {
          x: clamp(a.start.x + dx, 0, Math.max(0, canvasW - a.start.w)),
          y: clamp(a.start.y + dy, 0, Math.max(0, canvasH - a.start.h)),
        });
      } else {
        updateElement(a.id, {
          w: clamp(a.start.w + dx, 40, canvasW - a.start.x),
          h: clamp(a.start.h + dy, 30, canvasH - a.start.y),
        });
      }
    }
    function up() {
      actionRef.current = null;
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, canvasW, canvasH, projectType]);

  // Delete/Backspace remove o elemento selecionado (fora de campos de texto).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        removeElement(selectedId);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function updateElement(id: string, patch: Record<string, unknown>) {
    setElements((prev) => prev.map((e) => (e.id === id ? ({ ...e, ...patch } as MoodboardElement) : e)));
  }

  function removeElement(id: string) {
    setElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }

  function bringToFront(id: string) {
    const z = nextZ();
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, z } : e)));
  }

  function changeType(next: ProjectType) {
    if (next === projectType) return;
    setProjectType(next);
    setSelectedId(null);
  }

  function openReplaceWithImage(id: string) {
    replaceTargetId.current = id;
    replaceInputRef.current?.click();
  }

  function replaceWithImage(file: File | undefined) {
    const id = replaceTargetId.current;
    replaceTargetId.current = null;
    if (!file || !id) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setElements((prev) =>
        prev.map((e) => (e.id === id ? { id: e.id, type: "image", src, x: e.x, y: e.y, w: e.w, h: e.h, z: e.z, role: e.role } : e))
      );
    };
    reader.readAsDataURL(file);
  }

  function resetToTemplate() {
    if (elements.length > 0 && !window.confirm("Isso restaura o modelo original deste tipo de projeto, substituindo o board atual. Continuar?")) return;
    const specs = cfg.build();
    const withIds = specs.map((spec) => ({ ...spec, id: uid(), z: nextZ() }) as MoodboardElement);
    setElements(withIds);
    setBgColor(cfg.bg);
    setSelectedId(null);
  }

  /** Aplica a paleta extraída nos papéis "-bg" do modelo atual, recolorindo
   *  automaticamente o texto sobreposto (papel "-text" correspondente) para
   *  manter contraste legível. */
  function applyPalette(palette: string[]) {
    const roleColor: Record<string, string> = {};
    cfg.paletteRoles.forEach((role, i) => {
      if (palette[i]) roleColor[role] = palette[i];
    });
    let swatchIdx = 0;
    setElements((prev) =>
      prev.map((e) => {
        if (e.type === "color" && e.role === "palette-swatch") {
          const hex = palette[swatchIdx % palette.length];
          swatchIdx++;
          return { ...e, hex };
        }
        if (e.type === "color" && e.role && roleColor[e.role]) {
          return { ...e, hex: roleColor[e.role] };
        }
        if (e.type === "text" && e.role?.endsWith("-text")) {
          const bgRole = e.role.replace(/-text$/, "-bg");
          if (roleColor[bgRole]) return { ...e, color: bestTextColor(roleColor[bgRole]) };
        }
        return e;
      })
    );
  }

  async function applyLogo(file: File) {
    const src = await readAsDataURL(file);
    setElements((prev) => {
      const withLogo = prev.map((e) =>
        e.role === cfg.logoBgRole ? { id: e.id, type: "image" as const, src, x: e.x, y: e.y, w: e.w, h: e.h, z: e.z, role: e.role } : e
      );
      return withLogo.filter((e) => e.role !== cfg.logoTextRole);
    });
    try {
      const palette = await extractPalette(src, Math.max(cfg.paletteRoles.length, 5));
      applyPalette(palette);
    } catch {
      // Falha na extração não deve travar o upload da logo.
    }
  }

  async function applyScreens(fileList: FileList | null) {
    if (!fileList || cfg.screenRoles.length === 0) return;
    const files = Array.from(fileList).slice(0, cfg.screenRoles.length);
    const srcs = await Promise.all(files.map(readAsDataURL));
    setElements((prev) => {
      let next = prev;
      srcs.forEach((src, i) => {
        const role = cfg.screenRoles[i];
        const textRole = role.replace(/-bg$/, "-text");
        next = next
          .map((e) => (e.role === role ? { id: e.id, type: "image" as const, src, x: e.x, y: e.y, w: e.w, h: e.h, z: e.z, role: e.role } : e))
          .filter((e) => e.role !== textRole);
      });
      return next;
    });
  }

  async function handleExport() {
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasW, canvasH);

      const sorted = [...elements].sort((a, b) => a.z - b.z);
      for (const el of sorted) {
        if (el.type === "image") {
          try {
            const img = await loadImageAsync(el.src);
            if (el.role === "logo-bg") {
              // Logo: cabe inteira dentro do quadro, sem cortar, com um respiro.
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(el.x, el.y, el.w, el.h);
              const pad = 16;
              const availW = Math.max(1, el.w - pad * 2);
              const availH = Math.max(1, el.h - pad * 2);
              const s = Math.min(availW / img.naturalWidth, availH / img.naturalHeight);
              const dw = img.naturalWidth * s;
              const dh = img.naturalHeight * s;
              ctx.drawImage(img, el.x + (el.w - dw) / 2, el.y + (el.h - dh) / 2, dw, dh);
            } else {
              const coverScale = Math.max(el.w / img.naturalWidth, el.h / img.naturalHeight);
              const sw = el.w / coverScale;
              const sh = el.h / coverScale;
              const sx = (img.naturalWidth - sw) / 2;
              const sy = (img.naturalHeight - sh) / 2;
              ctx.drawImage(img, sx, sy, sw, sh, el.x, el.y, el.w, el.h);
            }
          } catch {
            // Ignora imagem que falhar ao carregar no export.
          }
        } else if (el.type === "color") {
          ctx.fillStyle = el.hex;
          ctx.fillRect(el.x, el.y, el.w, el.h);
          if (el.w >= 48 && el.h >= 40) {
            ctx.fillStyle = bestTextColor(el.hex);
            ctx.font = "700 12px monospace";
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            ctx.fillText(el.hex.toUpperCase(), el.x + 8, el.y + el.h - 8);
          }
        } else {
          const pad = el.pad ?? 0;
          const innerX = el.x + pad;
          const innerY = el.y + pad;
          const innerW = Math.max(1, el.w - pad * 2);
          const innerH = Math.max(1, el.h - pad * 2);
          ctx.fillStyle = el.color;
          ctx.font = `${el.weight} ${el.fontSize}px ${el.fontFamily}`;
          ctx.textAlign = el.align;
          ctx.textBaseline = "top";
          const tx = el.align === "left" ? innerX : el.align === "right" ? innerX + innerW : innerX + innerW / 2;
          drawWrappedText(ctx, el.content, tx, innerY, innerW, innerH, el.fontSize * 1.25, el.valign);
        }
      }

      const url = canvas.toDataURL("image/png");
      downloadUrl(url, `moodboard-${projectType}-${Date.now()}.png`);
    } finally {
      setExporting(false);
    }
  }

  function beginMove(e: React.PointerEvent, el: MoodboardElement) {
    e.stopPropagation();
    setSelectedId(el.id);
    bringToFront(el.id);
    actionRef.current = { id: el.id, mode: "move", startClientX: e.clientX, startClientY: e.clientY, start: { x: el.x, y: el.y, w: el.w, h: el.h } };
  }

  function beginResize(e: React.PointerEvent, el: MoodboardElement) {
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(el.id);
    actionRef.current = { id: el.id, mode: "resize", startClientX: e.clientX, startClientY: e.clientY, start: { x: el.x, y: el.y, w: el.w, h: el.h } };
  }

  const selected = elements.find((e) => e.id === selectedId) || null;
  const logoEl = elements.find((e) => e.role === cfg.logoBgRole);
  const hasLogo = logoEl?.type === "image";
  const screensDone = cfg.screenRoles.filter((r) => elements.find((e) => e.role === r)?.type === "image").length;
  const bgSiblingRole = selected?.type === "text" && selected.role?.endsWith("-text") ? selected.role.replace(/-text$/, "-bg") : null;
  const bgSibling = bgSiblingRole ? elements.find((e) => e.role === bgSiblingRole) : undefined;

  return (
    <div>
      {/* Seletor de tipo de projeto + exportar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {(Object.keys(PROJECT_META) as ProjectType[]).map((key) => {
          const meta = PROJECT_META[key];
          const Icon = meta.icon;
          const active = projectType === key;
          return (
            <button
              key={key}
              onClick={() => changeType(key)}
              title={meta.hint}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                background: active ? "var(--accent)" : "var(--surface)",
                color: active ? "#fff" : "var(--text)",
                fontSize: 12, fontWeight: 600,
              }}
            >
              <Icon size={14} color={active ? "#fff" : "var(--text-muted)"} />
              {meta.label}
            </button>
          );
        })}

        <button onClick={handleExport} disabled={exporting} style={{ ...toolbarBtn, background: "var(--accent)", color: "#fff", border: "none", marginLeft: "auto", opacity: exporting ? 0.6 : 1 }}>
          <Download size={14} /> {exporting ? "Gerando..." : "Baixar PNG"}
        </button>
      </div>

      <input ref={replaceInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { replaceWithImage(e.target.files?.[0]); e.target.value = ""; }} />

      {/* Board + painel lateral */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div ref={wrapRef} style={{ flex: "1 1 480px", minWidth: 280 }}>
          <div style={{ width: canvasW * scale, height: canvasH * scale, maxWidth: "100%" }}>
            <div
              onPointerDown={() => setSelectedId(null)}
              style={{
                width: canvasW, height: canvasH, transform: `scale(${scale})`, transformOrigin: "top left",
                position: "relative", background: bgColor, borderRadius: 12, overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              {elements.length === 0 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
                  <span style={{ color: "#00000066", fontSize: 15, maxWidth: 320 }}>
                    Adicione imagens, cores e textos usando os botões acima para montar seu moodboard.
                  </span>
                </div>
              )}
              {[...elements].sort((a, b) => a.z - b.z).map((el) => {
                const isSelected = selectedId === el.id;
                const isLogo = el.role === "logo-bg";
                return (
                  <div
                    key={el.id}
                    onPointerDown={(e) => beginMove(e, el)}
                    style={{
                      position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h,
                      outline: isSelected ? "2px solid var(--accent)" : "1px solid transparent",
                      outlineOffset: 2, cursor: "move", boxSizing: "border-box",
                    }}
                  >
                    {el.type === "image" && (
                      <div style={{ width: "100%", height: "100%", borderRadius: 6, overflow: "hidden", background: isLogo ? "#ffffff" : "transparent", boxSizing: "border-box" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={el.src}
                          alt=""
                          draggable={false}
                          style={{
                            width: "100%", height: "100%", display: "block", pointerEvents: "none", boxSizing: "border-box",
                            objectFit: isLogo ? "contain" : "cover",
                            padding: isLogo ? 16 : 0,
                          }}
                        />
                      </div>
                    )}
                    {el.type === "color" && (
                      <div style={{ width: "100%", height: "100%", background: el.hex, borderRadius: 6, display: "flex", alignItems: "flex-end", padding: el.w >= 48 ? 8 : 0, boxSizing: "border-box" }}>
                        {el.w >= 48 && el.h >= 40 && (
                          <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: bestTextColor(el.hex), opacity: 0.85 }}>{el.hex.toUpperCase()}</span>
                        )}
                      </div>
                    )}
                    {el.type === "text" && (
                      <div
                        style={{
                          width: "100%", height: "100%", overflow: "hidden", boxSizing: "border-box",
                          display: "flex", flexDirection: "column",
                          justifyContent: el.valign === "center" ? "center" : el.valign === "end" ? "flex-end" : "flex-start",
                          padding: el.pad ?? 0,
                        }}
                      >
                        <div style={{ fontFamily: el.fontFamily, fontSize: el.fontSize, fontWeight: el.weight, color: el.color, textAlign: el.align, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.25 }}>
                          {el.content}
                        </div>
                      </div>
                    )}
                    {isSelected && (
                      <>
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                          title="Remover"
                          style={{ position: "absolute", top: -10, right: -10, width: 22, height: 22, borderRadius: "50%", background: "#ef4444", color: "#fff", border: "2px solid #fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                        >
                          <X size={12} />
                        </button>
                        <div
                          onPointerDown={(e) => beginResize(e, el)}
                          style={{ position: "absolute", right: -6, bottom: -6, width: 14, height: 14, borderRadius: 4, background: "var(--accent)", border: "2px solid #fff", cursor: "nwse-resize" }}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 10 }}>
            Arraste para mover · use o canto inferior direito para redimensionar · Delete remove o item selecionado.
          </p>
        </div>

        {/* Painel lateral: ajustes do board + propriedades do item selecionado */}
        <div style={{ ...panelStyle, width: 280, flexShrink: 0, padding: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Ajustes do board
            </div>

            <input ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) applyLogo(f); e.target.value = ""; }} />
            <button onClick={() => logoInputRef.current?.click()} style={{ ...toolbarBtn, width: "100%", justifyContent: "center", background: "var(--accent)", color: "#fff", border: "none" }}>
              <ImagePlus size={14} /> {hasLogo ? "Trocar logo" : "Enviar logo"}
            </button>
            {hasLogo && logoEl?.type === "image" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoEl.src} alt="Logo" style={{ width: 28, height: 28, objectFit: "contain", background: "#fff", borderRadius: 6, border: "1px solid var(--border)", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Cores extraídas automaticamente no modelo.</span>
              </div>
            ) : (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>As cores do board são extraídas da sua logo.</span>
            )}

            {cfg.screenRoles.length > 0 && (
              <>
                <input ref={screensInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => { applyScreens(e.target.files); e.target.value = ""; }} />
                <button onClick={() => screensInputRef.current?.click()} style={{ ...toolbarBtn, width: "100%", justifyContent: "center" }}>
                  <Images size={14} /> Enviar {cfg.screenLabel} ({screensDone}/{cfg.screenRoles.length})
                </button>
              </>
            )}

            <button onClick={resetToTemplate} style={{ ...toolbarBtn, width: "100%", justifyContent: "center" }} title="Restaura o modelo original deste tipo de projeto (logo e telas enviadas são perdidas).">
              <RotateCcw size={14} /> Restaurar modelo
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Fundo do board</span>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)", padding: 2, cursor: "pointer", background: "none" }} />
            </div>
          </div>

          {!selected ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
              Selecione um item no board para editar suas propriedades.
            </p>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {selected.type === "image" ? "Imagem" : selected.type === "color" ? "Cor" : "Texto"}
              </div>

              {selected.type === "text" && (
                <>
                  <label style={labelStyle}>Conteúdo</label>
                  <textarea value={selected.content} onChange={(e) => updateElement(selected.id, { content: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />

                  <label style={labelStyle}>Fonte</label>
                  <select value={selected.fontFamily} onChange={(e) => updateElement(selected.id, { fontFamily: e.target.value })} style={inputStyle}>
                    {FONTS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>

                  <label style={labelStyle}>Tamanho: {selected.fontSize}px</label>
                  <input type="range" min={12} max={140} value={selected.fontSize} onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) })} style={{ width: "100%" }} />

                  <label style={labelStyle}>Peso</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[{ v: 400, l: "Normal" }, { v: 600, l: "Médio" }, { v: 800, l: "Negrito" }].map((o) => (
                      <button key={o.v} onClick={() => updateElement(selected.id, { weight: o.v })} style={toggleBtn(selected.weight === o.v)}>{o.l}</button>
                    ))}
                  </div>

                  <label style={labelStyle}>Alinhamento</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["left", "center", "right"] as Align[]).map((a) => (
                      <button key={a} onClick={() => updateElement(selected.id, { align: a })} style={toggleBtn(selected.align === a)}>{a === "left" ? "Esq" : a === "center" ? "Centro" : "Dir"}</button>
                    ))}
                  </div>

                  <label style={labelStyle}>Cor do texto</label>
                  <input type="color" value={selected.color} onChange={(e) => updateElement(selected.id, { color: e.target.value })} style={colorInputBoxStyle} />

                  {bgSibling && (
                    <>
                      <label style={labelStyle}>Fundo do bloco</label>
                      {bgSibling.type === "color" ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input type="color" value={bgSibling.hex} onChange={(e) => updateElement(bgSibling.id, { hex: e.target.value })} style={{ width: 40, height: 34, borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", padding: 2, background: "none", flexShrink: 0 }} />
                          <button onClick={() => openReplaceWithImage(bgSibling.id)} style={{ ...smallBtnStyle(), flex: 1 }} title="Usa uma imagem no lugar da cor de fundo deste bloco.">
                            <ImageIcon size={13} /> Inserir imagem
                          </button>
                        </div>
                      ) : bgSibling.type === "image" ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={bgSibling.src} alt="" style={{ width: 40, height: 34, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)", flexShrink: 0 }} />
                          <button onClick={() => openReplaceWithImage(bgSibling.id)} style={{ ...smallBtnStyle(), flex: 1 }}>
                            <ImageIcon size={13} /> Trocar imagem
                          </button>
                        </div>
                      ) : null}
                    </>
                  )}
                </>
              )}

              {selected.type === "color" && (
                <>
                  <label style={labelStyle}>Cor</label>
                  <input type="color" value={selected.hex} onChange={(e) => updateElement(selected.id, { hex: e.target.value })} style={colorInputBoxStyle} />
                  <button onClick={() => openReplaceWithImage(selected.id)} style={{ ...smallBtnStyle(), width: "100%", marginTop: 10 }} title="Substitui este bloco por uma imagem (ex: sua logo), mantendo o mesmo tamanho e posição.">
                    <ImageIcon size={13} /> Usar imagem (logo, foto...)
                  </button>
                </>
              )}

              {selected.type === "image" && (
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.6 }}>
                  Arraste para mover e use o canto inferior direito para redimensionar a imagem.
                </p>
              )}

              <button onClick={() => removeElement(selected.id)} style={{ ...smallBtnStyle(true), width: "100%", marginTop: 16 }}>
                <Trash2 size={13} /> Remover
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
