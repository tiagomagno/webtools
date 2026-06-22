# Status de Implementação — WEBTOOLS

> Atualizado a cada execução do orquestrador.
> Última atualização: 2026-06-22 (Fase P3 completa — 23 ferramentas implementadas)

## Progresso geral
- **Roadmap numerado (P1+P2+P3):** 100 / 100 concluídas ✅
- **Fase atual:** P3 ✅ CONCLUÍDA — PROJETO FINALIZADO
- **Build:** 114 rotas estáticas (○), zero erros.
- **Ferramentas pré-existentes (fora da contagem):** 9

## Infraestrutura compartilhada (criada nas fases P1 + P2)
- `src/app/lib/seo.ts` — `toolMetadata()` + `SITE_URL` (metadata padronizada)
- `src/app/components/ToolPage.tsx` — shell server (breadcrumb, hero, conteúdo, FAQ, relacionadas, CTA, JSON-LD WebApplication + FAQPage + BreadcrumbList)
- `src/app/lib/text-stats.ts` — estatísticas de texto (#1, #2, #3)
- `src/app/lib/line-diff.ts` — diff de linhas LCS (#4)
- `src/app/lib/json-tools.ts` — parse com posição de erro + diff estrutural (#6, #7, #8)
- `src/app/lib/sql-format.ts` — formatador SQL leve (#9)
- `src/app/lib/base64.ts` — Base64 UTF-8 + Base64URL (#10, #11, #12)
- `src/app/lib/hash.ts` — MD5 (JS puro) + SHA via Web Crypto (#14)
- `src/app/lib/seo-tools.ts` — UTM builder, robots.txt builder e estimativa de pixels SERP (#15, #16, #17, #18)
- `src/app/lib/image-tools.ts` — load/encode de imagem via canvas (com resize e crop), fmtBytes, download (#19–#25)
- `src/app/components/FormatConverter.tsx` — conversor de formato genérico por canvas (#20, #21, #22)
- `src/app/lib/pdf-tools.ts` — carregamento de pdfjs/pdf-lib, rasterização, contagem e parse de intervalos de página (#26–#30)
- `src/app/lib/csv-json.ts` — parser CSV (RFC 4180) + csvToJson/jsonToCsv (#31, #32)
- `src/app/lib/markdown.ts` — Markdown→HTML em JS puro, sem dependência (#33)
- `src/app/lib/slugify.ts` — geração de slug com remoção de acentos (#34)
- `src/app/components/CsvJsonTool.tsx` — componente compartilhado CSV↔JSON via prop `mode` (#31, #32)
- `src/app/lib/password.ts` — geração de senha + estimativa de força/entropia (#38)
- `src/app/lib/uuid.ts` — geração/formatação de UUID v4 (#13 refatorado, #39)
- `src/app/components/Base64Tool.tsx` — componente compartilhado encode/decode (#10, #11)
- Dependências adicionadas (autorizadas): `qrcode` + `@types/qrcode` (#36), `jsqr` (#37)
- `src/app/layout.tsx` — metadataBase + title template + `viewport` export (corrige aviso global)
- `src/app/lib/format.ts` — `num()`, `brl()`, `pct()` helpers pt-BR para calculadoras (#41–#47)
- `src/app/lib/text-transform.ts` — case, reversal, line ops, Caesar cipher, número por extenso (#46–#52)
- `src/app/lib/cpf-cnpj.ts` — geração e validação de CPF e CNPJ (#58–#61)
- `src/app/lib/units.ts` — tabelas de conversão de unidades físicas (#65)
- `src/app/lib/dev-tools.ts` — HTML formatter, CSS minifier, conversor de bases (#54–#56)
- `src/app/lib/finance.ts` — SAC/PRICE, INSS/IRPF 2026, rescisão, reajuste, investimentos (#71–#75)

## Concluídas

| # | Ferramenta | Rota | Categoria | Util reaproveitado |
|---|------------|------|-----------|--------------------|
| 1 | Contador de Palavras | /tools/contador-palavras | Texto | text-stats |
| 2 | Contador de Caracteres | /tools/contador-caracteres | Texto | text-stats |
| 3 | Tempo de Leitura | /tools/tempo-leitura | Texto | text-stats |
| 4 | Comparador de Textos | /tools/comparador-textos | Texto | line-diff |
| 5 | Removedor de Linhas | /tools/removedor-linhas | Texto | — |
| 6 | JSON Formatter | /tools/json-formatter | Dev | json-tools |
| 7 | JSON Validator | /tools/json-validator | Dev | json-tools |
| 8 | JSON Diff | /tools/json-diff | Dev | json-tools |
| 9 | SQL Formatter | /tools/sql-formatter | Dev | sql-format |
| 10 | Base64 Encode | /tools/base64-encode | Dev | base64 + Base64Tool |
| 11 | Base64 Decode | /tools/base64-decode | Dev | base64 + Base64Tool |
| 12 | JWT Decoder | /tools/jwt-decoder | Dev | base64 |
| 13 | Gerador de UUID | /tools/uuid-generator | Dev | crypto.randomUUID |
| 14 | Gerador de Hash | /tools/hash-generator | Dev | hash |
| 15 | Open Graph Preview | /tools/open-graph-preview | SEO | seo-tools |
| 16 | Gerador de robots.txt | /tools/robots-generator | SEO | seo-tools |
| 17 | Gerador de UTM | /tools/gerador-utm | SEO | seo-tools |
| 18 | SERP Preview | /tools/serp-preview | SEO | seo-tools |
| 19 | Compressor de Imagem | /tools/compressor-imagem | Imagens | image-tools |
| 20 | JPG para PNG | /tools/jpg-para-png | Imagens | image-tools + FormatConverter |
| 21 | PNG para JPG | /tools/png-para-jpg | Imagens | image-tools + FormatConverter |
| 22 | Conversor WebP | /tools/webp-converter | Imagens | image-tools + FormatConverter |
| 23 | Redimensionador de Imagem | /tools/redimensionador-imagem | Imagens | image-tools |
| 24 | Cortador de Imagem | /tools/cortador-imagem | Imagens | image-tools (crop) |
| 25 | Gerador de Favicon | /tools/gerador-favicon | Imagens | image-tools (crop) |
| 26 | JPG para PDF | /tools/jpg-para-pdf | PDF | pdf-tools |
| 27 | PDF para JPG | /tools/pdf-para-jpg | PDF | pdf-tools |
| 28 | Unir PDF | /tools/unir-pdf | PDF | pdf-tools |
| 29 | Dividir PDF | /tools/dividir-pdf | PDF | pdf-tools |
| 30 | Compactar PDF | /tools/pdf-compressor | PDF | consolidado no pdf-compressor existente |
| 31 | CSV para JSON | /tools/csv-para-json | Dados | csv-json + CsvJsonTool |
| 32 | JSON para CSV | /tools/json-para-csv | Dados | csv-json + CsvJsonTool |
| 33 | Markdown para HTML | /tools/markdown-para-html | Dev | markdown |
| 34 | Texto para Slug | /tools/texto-para-slug | Texto | slugify |
| 35 | Timestamp Unix | /tools/unix-timestamp | Dev | — |
| 36 | Gerador de QR Code | /tools/gerador-qr | Utilidades | qrcode |
| 37 | Leitor de QR Code | /tools/leitor-qr | Utilidades | jsqr |
| 38 | Gerador de Senhas | /tools/gerador-senha | Utilidades | password |
| 39 | UUID em Massa | /tools/uuid-massa | Utilidades | uuid |
| 40 | Sorteador | /tools/sorteador | Utilidades | — |
| 41 | Calculadora de Idade | /tools/calculadora-idade | Calculadoras | format |
| 42 | Calculadora de IMC | /tools/calculadora-imc | Calculadoras | format |
| 43 | Calculadora de Porcentagem | /tools/calculadora-porcentagem | Calculadoras | format |
| 44 | Calculadora de Desconto | /tools/calculadora-desconto | Calculadoras | format |
| 45 | Juros Compostos | /tools/juros-compostos | Calculadoras | format |
| E1 | Calculadora de Datas | /tools/calculadora-datas | Calculadoras | — |
| E2 | Conversor de Temperatura | /tools/conversor-temperatura | Calculadoras | — |

Todas com SEO completo (metadata + OpenGraph + Twitter + canonical + JSON-LD triplo), FAQ, relacionadas e CTA, prerenderizadas como estáticas.

## Verificação
- `next build` ✅ — 48 rotas de ferramentas, todas estáticas (○), compilação sem erros.
- MD5 validado contra vetores conhecidos (`abc`, string vazia) — OK.
- Bloco Utilidades (#36–#40) concluído; categoria **Utilidades** criada.
- `npm audit`: 2 vulnerabilidades (1 high Next.js, 1 moderate PostCSS) — **pré-existentes, não vieram de `qrcode`/`jsqr`**. Correção exige subir o Next.js para fora do range declarado (`audit fix --force`) — não aplicado (requer autorização).
- ⚠️ As ferramentas com canvas, pointer events, câmera e libs (pdfjs/qrcode/jsqr) só são validadas plenamente em runtime — recomenda-se teste manual no navegador (especialmente #24 cortador, #27 pdf→jpg, #37 leitor QR via câmera). Markdown (#33) usa parser próprio — convém validar casos de borda.

## Em andamento
_nenhuma_

## Bloqueios
_nenhum_

## Status final
**🎉 Projeto concluído! 100 ferramentas implementadas em P1 + P2 + P3.**
- `next build` ✅ — 114 rotas, todas estáticas (○), zero erros.
- Novas libs: `luhn.ts`, `morse.ts`, `finance2.ts`.

## P2 — Ferramentas implementadas

| # | Ferramenta | Rota | Categoria | Lib |
|---|------------|------|-----------|-----|
| 46 | Formatador de Texto | /tools/formatador-texto | Texto | text-transform |
| 47 | Inversor de Texto | /tools/inversor-texto | Texto | text-transform |
| 48 | Contador de Linhas | /tools/contador-linhas | Texto | text-transform |
| 49 | Removedor de Acentos | /tools/removedor-acentos | Texto | text-transform |
| 50 | Ordenador de Linhas | /tools/ordenador-linhas | Texto | text-transform |
| 51 | Cifra de César | /tools/cifra-cesar | Texto | text-transform |
| 52 | Número por Extenso | /tools/numero-por-extenso | Texto | text-transform |
| 53 | Testador de Regex | /tools/regex-tester | Dev | — |
| 54 | HTML Formatter | /tools/html-formatter | Dev | dev-tools |
| 55 | Minificador de CSS | /tools/css-minifier | Dev | dev-tools |
| 56 | Conversor de Bases | /tools/conversor-bases | Dev | dev-tools |
| 57 | Tabela ASCII | /tools/tabela-ascii | Dev | — |
| 58 | Gerador de CPF | /tools/gerador-cpf | Utilidades BR | cpf-cnpj |
| 59 | Validador de CPF | /tools/validador-cpf | Utilidades BR | cpf-cnpj |
| 60 | Gerador de CNPJ | /tools/gerador-cnpj | Utilidades BR | cpf-cnpj |
| 61 | Validador de CNPJ | /tools/validador-cnpj | Utilidades BR | cpf-cnpj |
| 62 | Validador de E-mail | /tools/validador-email | Utilidades BR | — |
| 63 | Formatador de Telefone | /tools/formatador-telefone | Utilidades BR | — |
| 64 | Calculadora de Horas | /tools/calculadora-horas | Calculadoras | — |
| 65 | Conversor de Unidades | /tools/conversor-unidades | Calculadoras | units |
| 66 | Calculadora de Combustível | /tools/calculadora-combustivel | Calculadoras | — |
| 67 | Calculadora de Gorjeta | /tools/calculadora-gorjeta | Calculadoras | — |
| 68 | Regra de Três | /tools/regra-de-tres | Calculadoras | — |
| 69 | Calculadora de Calorias | /tools/calculadora-calorias | Calculadoras | — |
| 70 | Calculadora de Macros | /tools/calculadora-macros | Calculadoras | — |
| 71 | Simulador de Financiamento | /tools/simulador-financiamento | Finanças | finance |
| 72 | Calculadora de Salário | /tools/calculadora-salario | Finanças | finance |
| 73 | Calculadora de Rescisão | /tools/calculadora-rescisao | Finanças | finance |
| 74 | Reajuste de Aluguel | /tools/reajuste-aluguel | Finanças | finance |
| 75 | Comparador de Investimentos | /tools/calculadora-investimento | Finanças | finance |
