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

## 2026-10-08: Tipagem estrita no build (tarefa 6.3)
- **Contexto:** `ignoreBuildErrors: true` escondia 30 erros de TypeScript.
- **Decisão:** zerar os erros e remover a flag; o build passa a falhar em erro de tipo. Correções sem mudar o resultado ao usuário, com três exceções de comportamento mínimo: (1) `toolMetadata` aceita `keywords` e agora emite `<meta name="keywords">` nas 14 páginas que já os declaravam; (2) `calcRescisao` passa a declarar `vacationBalance` como `boolean` (o código só usava a verdade do valor); (3) `pdf-compressor` passa `canvas` ao `page.render` do pdfjs v6. Ícones da home trocaram o atributo `title`, que não gerava tooltip, por `aria-label`.
- **Alternativas descartadas:** manter a flag e tratar erros aos poucos (esconde bugs reais).
- **Tarefa relacionada:** 6.3
- **Certeza:** ✅

## 2026-10-08: Vitest adotado para os utils puros (tarefa 6.4)
- **Contexto:** a decisão de 2026-06-21 (sem runner, por falta de autorização para novas dependências) foi superada: o usuário autorizou o Vitest.
- **Decisão:** Vitest 4 como devDependency, ambiente Node, testes em `src/app/lib/__tests__/`, script `npm test`. Valores esperados vêm de fontes externas (RFC 1321, FIPS 180, tabelas de INSS/IRPF, cartões de teste públicos). Cobertos: finance, CPF/CNPJ, Luhn, hash, Base64, slugify, text-stats e CSV↔JSON.
- **Resultado:** os testes expuseram um bug no Gerador de Cartão: `luhnCheckDigit` dobrava os dígitos na paridade errada, e os cartões gerados falhavam no próprio validador. Corrigido em `luhn.ts` (uma linha) e validado contra Visa/Mastercard/Amex de teste.
- **Fora do escopo:** componentes React, login e ferramentas ainda sem teste (json-tools, line-diff, units, password, uuid, text-transform).
- **Substitui:** a decisão "Sem runner de testes por enquanto" (2026-06-21).
- **Tarefa relacionada:** 6.4
- **Certeza:** ✅

## 2026-10-08: Lint no formato flat nativo do Next 16 e primeira medição Lighthouse (tarefas 6.5 e 6.6)
- **Lint (6.6):** o `eslint.config.mjs` usava `FlatCompat` para carregar `next/core-web-vitals`, que quebra com ESLint 9 + `eslint-config-next` 16 (referência circular no plugin react). Trocado por `defineConfig` com `eslint-config-next/core-web-vitals` e `/typescript`, ignorando `server/`, `electron/`, `public/` e `.next/`. Resultado: 246 arquivos analisados, 42 erros e 44 avisos (tarefa 6.7).
- **Lighthouse (6.5)**, Lighthouse 13.5, `https://webtools.tiagosmagno.com.br/login`, 3 execuções no celular e 2 no desktop, com o Kaspersky bloqueado:

  | Preset | Performance | SEO | Acessibilidade | Boas práticas | FCP / LCP |
  |---|---|---|---|---|---|
  | Celular | 99 | 100 | 93 | 77 | 1,6 s / 1,6 s |
  | Desktop | 100 | 100 | 93 | 77 | 0,5 s / 0,5 s |

  Metas (Perf ≥95, SEO ≥95, A11y ≥90): atendidas **na tela de login**.
- **Limite da medição:** todas as URLs de ferramenta redirecionam para `/login` sem sessão; as ferramentas por dentro não foram medidas (tarefa 6.9).
- **Medição contaminada:** sem bloquear `kaspersky-labs.com`, o antivírus do computador injeta ~850 KiB de JS/CSS e a nota de Performance cai para 66 no celular. A cota gratuita da API do PageSpeed estava esgotada (429).
- **Achados do site (6.8):** `/favicon.ico` dá 404; falta landmark `<main>`; contraste 4,46 (mínimo 4,5) no botão com texto branco sobre `--accent` `#6366f1`. As APIs "deprecated" vêm do script de desafio da Cloudflare, não do código.
- **Tarefa relacionada:** 6.5, 6.6
- **Certeza:** ✅

## 2026-10-08: Medição autenticada, correções de acessibilidade e lint (tarefas 6.7, 6.8 e 6.9)
- **Acesso às ferramentas:** o site em produção exige login e eu não uso credenciais reais nem crio usuário lá. A medição foi feita com um build local (`NEXT_PUBLIC_API_URL=http://localhost:3333`), uma API de mentira em `localhost` (`/auth/refresh`, `/me`, `/history`) com usuário fictício e o token fictício em `localStorage` (`wt-auth-tokens`), Lighthouse 13.5 via Puppeteer, bloqueando `*kaspersky-labs.com*`. Confirmado pela URL final de cada execução (a ferramenta, e não `/login`).
- **Resultado (local, sem CDN):**

  | Página | Preset | Perf | SEO | A11y | Boas práticas |
  |---|---|---|---|---|---|
  | Home, contador-palavras, pdf-compressor | Celular | 100 | 100 | 96–100 | 81 |
  | Home | Desktop | 100 | 100 | 96 | 81 |
  | `/login` (sem sessão, após 6.8) | Celular e desktop | 100 | 100 | 100 | 81 |

  Antes da 6.8, em produção, o `/login` tinha A11y 93 e Boas práticas 77. Boas práticas 81 local vem só de um script `http` do Kaspersky (`is-on-https`); não foi confirmado em produção.
- **Tokens de cor:** `--accent-strong` (#4f46e5, fundo de botão com texto branco) e `--accent-text` (#4f46e5 no claro, #818cf8 no escuro) para contraste ≥ 4,5. O `--accent` (#6366f1) com texto branco dá 4,46. Aplicados no login e no avatar do menu; outros usos de `--accent` com texto branco no site (cerca de 42) não foram trocados.
- **Lint (6.7):** 21 erros corrigidos; `set-state-in-effect` e `refs` rebaixadas a aviso. Mudanças de comportamento: `RegexTester` calcula resultado e erro no mesmo `useMemo` (antes chamava `setState` dentro dele); `JwtDecoder` avalia a expiração no instante em que o token é colado (antes lia `Date.now()` no render); `QrReader` usa função nomeada no laço da câmera.
- **SEO x login (achado):** o HTML sem sessão traz só `Carregando…`; o conteúdo de SEO das ferramentas não aparece no servidor. Pendente de decisão do usuário.
- **Tarefa relacionada:** 6.7, 6.8, 6.9
- **Certeza:** ✅

## 2026-10-08: Ferramentas abertas, conta opcional (tarefa 7.1)
- **Contexto:** o login era obrigatório (commit 30d8149) só para dar histórico por usuário, e isso barrava visitantes e deixava o HTML sem conteúdo para buscadores (`Carregando…`).
- **Decisão:** abrir todas as ferramentas. Só `/conta` e `/admin` exigem login (`PROTECTED_PREFIXES` em `AppChrome`). Sem sessão aparece "Entrar"; depois do login volta à ferramenta (`?next=` validado por `safeNextPath`, guardado em `sessionStorage` para o login com Google). Sem conta nada é salvo; com conta, histórico por usuário. A ideia é que o visitante use livremente e crie conta pelo histórico.
- **Alternativas descartadas:** manter o login obrigatório; salvar histórico anônimo no servidor (nada é salvo sem conta, por decisão do usuário).
- **Substitui:** a regra "login obrigatório" (RN1, `NEGOCIO.md` local).
- **Descobertas no caminho:** nenhuma ferramenta chama `useToolHistory` ainda (o histórico existe na API e no hook, mas não é usado: tarefa 7.2); o `ToolPage` não renderiza `content`, `faq`, `related` nem `ctaText` (tarefa 7.3); não há `sitemap.xml` nem `robots.txt` (7.4).
- **Tarefa relacionada:** 7.1 (spec em `docs/tarefas/7.1.md`)
- **Certeza:** ✅ (pedido do usuário)

## 2026-10-08: Deploy no Coolify é manual
- **Contexto:** depois de enviar 7 commits ao GitHub, a produção continuou no commit `d7e5a1a` (sem `/icon.svg`, sem `<main>` no login, sem `keywords`).
- **Decisão/achado:** os deploys aparecem como origem "Manual" no Coolify; `git push` não publica. Para publicar: Deploy no site e na API, ou ligar o webhook do GitHub (tarefa 7.5). Medir ou testar produção só depois de publicar.
- **Tarefa relacionada:** 7.5
- **Certeza:** ✅

## 2026-10-08: tsconfig da raiz não verifica `electron/` nem `server/`
- **Contexto:** o deploy do commit `2f2a15a` falhou no Coolify (`Cannot find module 'electron'` em `electron/src/main.ts`). O `next build` verifica os tipos de todo `.ts` da raiz e, num clone limpo, `electron/node_modules` e `server/node_modules` não existem. No computador do autor existem, por isso nunca falhava local. O `ignoreBuildErrors` (removido na 6.3) escondia o problema.
- **Decisão:** `exclude: ["node_modules", "electron", "server"]` no `tsconfig.json` da raiz; cada pacote tem o próprio `tsconfig` e é verificado pelo próprio build.
- **Como evitar:** antes de subir mudança de build, testar num clone limpo (`git clone` do GitHub, `npm ci`, `npm run build`), não só na pasta de trabalho.
- **Tarefa relacionada:** 7.5
- **Certeza:** ✅ (reproduzido e corrigido em clone limpo)
