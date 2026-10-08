# 📜 Decisões: Webtools
> Log que só acrescenta. Se uma decisão mudar, acrescente entrada nova que cite a anterior.

Legenda: ✅ confirmada · 💡 inferida do código

Decisões técnicas de 2026-06-21/22 (padrão server page + client component, `ToolPage`, utils puros, MD5 em JS puro, slugs em português, sem runner de testes, consolidação de `compactar-pdf`) estão registradas no arquivo local `project-management/decisions.md` (origem). Resumo do que continua valendo:

## 2026-06-21: Página de ferramenta = server page + componente client
- **Contexto:** SEO por página era requisito.
- **Decisão:** `page.tsx` server (metadata, JSON-LD, FAQ) + componente `"use client"` para a parte interativa; shell comum `ToolPage`.
- **Certeza:** ✅ (origem: project-management/decisions.md)

## 2026-06-21: Lógica em utils puros e registro único de ferramentas
- **Decisão:** cálculos em `src/app/lib/*.ts`; sidebar, home e bottom nav leem de `src/app/lib/tools.ts`.
- **Certeza:** ✅ (origem: project-management/decisions.md)

## 2026-06-21: Sem runner de testes por enquanto
- **Contexto:** regra global proíbe adicionar dependência sem autorização.
- **Decisão:** validar por `next build` e conferência manual; adicionar Vitest quando autorizado (tarefa 6.4).
- **Certeza:** ✅ (origem: project-management/decisions.md)

## 2026-10-08: Webtools separado do portfolio em repositório próprio
- **Contexto:** o webtools vivia em `webtools/` dentro do repo do portfolio, embora seja um produto independente (site, API e Electron).
- **Decisão:** mover para `C:\Projects\webtools` com histórico filtrado (32 commits) e repo GitHub privado `tiagomagno/webtools`. O histórico antigo permanece no repo do portfolio. Padronizar o contexto com a skill `novo-projeto` (nível completo).
- **Alternativas descartadas:** reescrever o histórico do portfolio (exigiria force push em repo público).
- **Tarefa relacionada:** 1.2, 6.1
- **Certeza:** ✅

## 2026-10-08: Documentos estratégicos ficam locais
- **Decisão:** `docs/PRODUTO.md` e `docs/NEGOCIO.md`, assim como `project-management/`, ficam fora do git (`.gitignore`); os documentos técnicos são versionados.
- **Motivo:** o repo é público (tornado público pelo usuário em 2026-10-08, como o repo anterior do portfolio); monetização e métricas não devem ser expostas.
- **Certeza:** ✅

## 2026-10-08: Domínio e hospedagem confirmados
- **Contexto:** `SITE_URL` e `metadataBase` estavam com o valor provisório `https://webtools.local`.
- **Decisão:** o site é um subdomínio do domínio principal: `https://webtools.tiagosmagno.com.br` (API em `api.tiagosmagno.com.br`), hospedado no Coolify. `SITE_URL` (`src/app/lib/seo.ts`) é a fonte única; `layout.tsx` a importa. O `FRONTEND_URL` da API deve ser a mesma origem do site (CORS e redirect do login Google).
- **Tarefa relacionada:** 6.2, 6.1
- **Certeza:** ✅ (informado pelo usuário)
