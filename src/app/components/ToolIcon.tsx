import { createElement } from "react";
import { toolIcon, categoryIcon } from "../lib/tool-icons";

/** Ícone Phosphor de uma ferramenta (substitui o emoji). */
export function ToolIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  return createElement(toolIcon(slug), { size, weight: "regular", "aria-hidden": true, style: { flexShrink: 0 } });
}

/** Ícone Phosphor de uma categoria. */
export function CategoryIcon({ category, size = 17, weight = "regular" }: { category: string; size?: number; weight?: "regular" | "bold" | "fill" }) {
  return createElement(categoryIcon(category), { size, weight, "aria-hidden": true, style: { flexShrink: 0 } });
}
