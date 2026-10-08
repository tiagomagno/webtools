# Estilo de código
TypeScript estrito (`strict: true`), ESLint `next/core-web-vitals` + `next/typescript`, Tailwind 4 com tokens em `var(--token)`. Textos de interface em português do Brasil; slugs de rota em português (exceção: termos técnicos consagrados como `json-formatter`).

## Assim sim: página de ferramenta (server) + componente client separado
```tsx
// src/app/tools/contador-palavras/page.tsx
import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import WordCounter from "./WordCounter";

export const metadata = toolMetadata({
  slug: "contador-palavras",
  title: "Contador de Palavras e Caracteres Online — Análise Completa de Texto",
  description: DESCRIPTION,
});

export default function Page() {
  return <ToolPage slug="contador-palavras" emoji="📝" title="Analisador e Contador de Texto" /* ... */ />;
}
```
A lógica de cálculo fica em `src/app/lib/*.ts` (puro, sem React) e a ferramenta é registrada em `src/app/lib/tools.ts`.
