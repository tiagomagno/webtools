# Decisões de Arquitetura — WEBTOOLS

> Registro cronológico de decisões técnicas do orquestrador de roadmap.

## 2026-06-21 — Setup inicial do orquestrador

### Padrão de página de ferramenta (SEO + interatividade)
**Contexto:** As ferramentas pré-existentes são componentes `"use client"` sem `metadata` por página, o que limita o SEO (requisito explícito do roadmap).
**Decisão:** Para novas ferramentas, adotar o padrão **server page + client component**:
- `page.tsx` é Server Component → exporta `metadata` e renderiza JSON-LD, hero, FAQ e "ferramentas relacionadas" como HTML indexável.
- A parte interativa fica em um componente filho `"use client"` separado.
**Motivo:** Maximiza SEO (conteúdo server-rendered + structured data) sem reescrever as ferramentas existentes. Aditivo, não destrutivo.

### Lógica em utils puros
**Decisão:** Lógica de cálculo vai em `src/app/lib/*.ts` puros (ex.: `text-stats.ts`), separada da UI.
**Motivo:** Reaproveitamento entre ferramentas relacionadas (#1/#2/#3 compartilham contagem de texto) e testabilidade.

### Framework de testes
**Contexto:** O projeto não tem runner de testes (jest/vitest) instalado. As regras globais proíbem adicionar dependências sem autorização.
**Decisão:** Não instalar runner de testes por enquanto. Verificação por `next build` + validação manual da lógica nos utils. Quando o usuário autorizar, adicionar Vitest e portar os utils para testes unitários.

### Registro de ferramentas
**Decisão:** Continuar usando `src/app/lib/tools.ts` como registro único. Sidebar, Home e BottomNav já consomem dele — adicionar a entrada propaga automaticamente. Sem duplicação.

### Idioma e slugs
**Decisão:** Slugs em português (ex.: `contador-palavras`) para SEO no público-alvo pt-BR, alinhado às rotas existentes. Exceção: ferramentas de dev com nomes consagrados em inglês mantêm o termo técnico (`json-formatter`, `base64-encode`, `jwt-decoder`).

## 2026-06-21 — Lote #2–#14 (modo em lote autorizado pelo usuário)

### Componente shell `ToolPage`
**Contexto:** Replicar hero/FAQ/relacionadas/CTA/JSON-LD em cada página geraria muita duplicação (violando a regra "não duplicar código").
**Decisão:** Criar `src/app/components/ToolPage.tsx` (Server Component) que centraliza breadcrumb, hero, seção de conteúdo, FAQ, relacionadas, CTA e os 3 blocos de JSON-LD. Cada `page.tsx` só fornece dados + o componente interativo. A `contador-palavras` (feita na execução anterior) foi migrada para este shell.
**Motivo:** DRY, consistência visual/SEO e manutenção centralizada.

### Utils puros por domínio
**Decisão:** `line-diff.ts` (LCS), `json-tools.ts` (parse+diff), `sql-format.ts`, `base64.ts`, `hash.ts`. Componente `Base64Tool` compartilhado entre encode/decode via prop `mode`.

### MD5 em JS puro
**Contexto:** Web Crypto (`crypto.subtle.digest`) não suporta MD5, apenas SHA-1/256/384/512.
**Decisão:** Implementar MD5 (RFC 1321) em JS puro em `hash.ts`, sem adicionar dependência. Validado contra vetores conhecidos (`abc`, vazio).

### Correção do aviso global de viewport
**Contexto:** Todas as páginas emitiam aviso "Unsupported metadata viewport" por causa de `metadata.viewport` no `layout.tsx` (padrão antigo do Next).
**Decisão:** Mover para `export const viewport: Viewport` no `layout.tsx` e adicionar `metadataBase` + `title.template`. Removeu o aviso de todas as rotas (inclusive as pré-existentes) sem alterar comportamento.

### Sobre o modo "uma por vez"
**Contexto:** O prompt do orquestrador exige uma ferramenta por execução. O usuário autorizou explicitamente o modo em lote (#2–#14) nesta sessão.
**Decisão:** Implementadas 13 ferramentas em lote por autorização direta. O fluxo padrão (uma por vez) permanece como default para execuções futuras sem autorização de lote.

## 2026-06-22 — Blocos SEO (#15–#18), Imagens (#19–#25) e PDF (#26–#30)

### Utils por domínio (continuação)
**Decisão:** `seo-tools.ts` (UTM/robots/pixels SERP), `image-tools.ts` (load/encode via canvas com resize e crop) e `pdf-tools.ts` (pdfjs+pdf-lib sob demanda, rasterização, intervalos de página). Componentes compartilhados `FormatConverter` (conversão de imagem) reutilizado por #20/#21/#22.

### Libs de PDF já presentes
**Contexto:** O bloco PDF exigia `pdf-lib` e `pdfjs-dist`. Ambas já estavam no `package.json` (usadas por `pdf-extractor`/`pdf-compressor`). Worker do pdfjs em `public/pdf.worker.min.mjs`.
**Decisão:** Reaproveitar as libs e o padrão de carregamento dinâmico já comprovado, sem adicionar dependências.

### #30 Compactar PDF — consolidação (não duplicar)
**Contexto:** O roadmap previa `compactar-pdf`, mas o projeto já tem a ferramenta pré-existente `pdf-compressor` (Compressão de PDF) com a mesma função (rasteriza + recomprime via canvas/JPEG).
**Decisão:** **Não criar rota duplicada.** O #30 é considerado coberto pela `pdf-compressor` existente. Criar uma segunda página com o mesmo propósito geraria canibalização de SEO e duplicação de código — proibido pelas regras globais.
**Motivo:** DRY + SEO. Caso futuramente se queira o slug `compactar-pdf` por volume de busca, a alternativa correta é renomear/redirecionar a ferramenta existente, não duplicá-la.

### Categoria "PDF"
**Decisão:** Criada a categoria **PDF** no registro. As ferramentas pré-existentes `pdf-extractor` e `pdf-compressor` foram movidas de "Texto" para "PDF" junto com as 4 novas, agrupando o domínio. Mudança apenas de rótulo de categoria no registro, sem alterar comportamento das ferramentas.

## 2026-06-22 — Bloco Dados/Conversões (#31–#35)

### CSV↔JSON: duas rotas, código único
**Contexto:** O usuário autorizou unificar duplicados livremente. CSV→JSON e JSON→CSV são conversões inversas.
**Decisão:** Mantidas **duas rotas** (`csv-para-json`, `json-para-csv`) por terem intenção de busca/SEO distintas, mas compartilhando 100% da lógica: lib `csv-json.ts` + componente `CsvJsonTool` parametrizado por `mode`. Segue o precedente do par Base64 encode/decode. Não é duplicação de código — é uma única implementação com duas entradas de SEO.

### Markdown→HTML sem dependência
**Contexto:** Não há lib de Markdown instalada (`marked`/`markdown-it`). Regras globais proíbem adicionar deps sem autorização.
**Decisão:** Implementar um conversor Markdown→HTML leve em JS puro (`markdown.ts`) cobrindo o subconjunto mais usado (títulos, ênfase, código, listas, citações, links, imagens, hr). HTML escapado por segurança.
**Trade-off:** Não cobre 100% do CommonMark (tabelas, listas aninhadas, HTML inline). Se o usuário precisar de paridade total, avaliar adicionar `marked` mediante autorização.

### Categoria "Dados"
**Decisão:** Criada a categoria **Dados** para CSV↔JSON. Markdown→HTML e Unix Timestamp ficaram em **Dev**; Texto→Slug em **Texto** — alinhado ao roadmap.

## 2026-06-22 — Bloco Utilidades (#36–#40)

### Dependências de QR autorizadas
**Contexto:** #36 (gerador) e #37 (leitor) de QR precisam de bibliotecas. Geração robusta e, principalmente, leitura de QR são inviáveis em JS puro com qualidade aceitável.
**Decisão:** Com **autorização explícita do usuário**, adicionadas `qrcode` (+ `@types/qrcode`) para geração e `jsqr` para leitura. `npm audit` confirmou que essas libs **não** introduziram vulnerabilidades — as 2 existentes são do Next.js/PostCSS e são pré-existentes.

### UUID — extração para lib compartilhada
**Contexto:** A `uuid-generator` (#13) tinha `generateUuid` inline; a #39 (massa) precisava da mesma lógica.
**Decisão:** Extraído para `src/app/lib/uuid.ts` (`generateUuid`, `formatUuid`, `generateUuids`). A `uuid-generator` foi refatorada para importar a lib — eliminando duplicação, conforme orientação do usuário de unificar quando possível.

### Aleatoriedade criptográfica
**Decisão:** Senha (#38) e Sorteador (#40) usam `crypto.getRandomValues` com correção de viés de módulo (rejeição) e embaralhamento Fisher-Yates. Evita o viés de `Math.random()` e garante distribuição uniforme — relevante para sorteios "justos".

### Categoria "Utilidades"
**Decisão:** Criada a categoria **Utilidades** (QR, senha, UUID massa, sorteador). UUID em Massa entrou em Utilidades (não Dev), agrupando com o gerador de senha por afinidade de uso.
