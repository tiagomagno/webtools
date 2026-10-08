# ✅ Tasks: Webtools
> Tarefas reconstruídas do histórico do Git e do roadmap antigo (marcadas 💡 até você confirmar) mais as pendentes.

| Versão | Atualizado em | Status | Fase atual |
|---|---|---|---|
| 0.1 | 2026-10-08 | 📝 Rascunho | 6 (Qualidade e entrega) |

> **Total** 28 · **Concluídas** 28 (100%) · **Em andamento** 0

Legenda: ✅ confirmado · 💡 hipótese · ❓ em aberto. Status: ✅ Concluída · 🔄 Em andamento · ⬜ Não iniciada · ⏸️ Bloqueada.
Datas "💡" vêm do `git log` (18/06 a 29/09/2026), sem data exata por tarefa.

## Fase 1: Setup
| # | Tarefa | Itens | Prioridade | Status | Pronto quando | Concluída em |
|---|---|---|---|---|---|---|
| 1.1 | Mini site inicial com ferramentas (77bfc2d) | — | 🔴 | ✅ | Site no ar | 💡 2026-06-18 |
| 1.2 | Separar em repositório próprio, com histórico | — | 🔴 | ✅ | Repo `tiagomagno/webtools` com os 32 commits | 2026-10-08 |

## Fase 2: Catálogo de ferramentas
| # | Tarefa | Itens | Prioridade | Status | Pronto quando | Concluída em |
|---|---|---|---|---|---|---|
| 2.0 | Fundação: `ToolPage`, `toolMetadata`, registro `tools.ts` | — | 🔴 | ✅ | Páginas com metadata + JSON-LD | 💡 2026-06-21 |
| 2.1 | Ferramentas P1 (#1–#45 do roadmap) | T2 | 🔴 | ✅ | Build sem erro | 💡 2026-06-22 |
| 2.2 | Ferramentas P2 | T2 | 🟡 | ✅ | Build sem erro | 💡 2026-06-22 |
| 2.3 | Ferramentas P3 (23) | T2 | 🟢 | ✅ | Roadmap 100/100 | 💡 2026-06-22 |
| 2.4 | Unificar 20 calculadoras e CPF/CNPJ em páginas com abas (+ redirects) | T2 | 🟡 | ✅ | URLs antigas redirecionam | 💡 ≤2026-09-29 |
| 2.5 | Transcrição de áudio e documento→Markdown | T2 | 🟡 | ✅ | Ferramentas no ar | 💡 ≤2026-09-29 |
| 2.6 | Conversor HEIC/HEIF → JPG | T2 | 🟢 | ✅ | Ferramenta no ar | 💡 ≤2026-09-29 |

## Fase 3: Plataforma (navegação)
| # | Tarefa | Itens | Prioridade | Status | Pronto quando | Concluída em |
|---|---|---|---|---|---|---|
| 3.0 | Layout dashboard e sua reestruturação | T1 | 🔴 | ✅ | Sidebar + home | 💡 ≤2026-09-29 |
| 3.1 | Layout mobile com bottom nav personalizável | T1 | 🔴 | ✅ | Funciona em celular | 💡 ≤2026-09-29 |
| 3.2 | Categorias, favoritos e recentes | T3 | 🟡 | ✅ | Menu de favoritos | 💡 ≤2026-09-29 |
| 3.3 | Breadcrumbs nas páginas internas | T2, T3 | 🟢 | ✅ | Em todas as páginas | 💡 ≤2026-09-29 |

## Fase 4: Conta e backend
| # | Tarefa | Itens | Prioridade | Status | Pronto quando | Concluída em |
|---|---|---|---|---|---|---|
| 4.0 | Backend Fastify + Prisma (auth e histórico) + migration inicial | E1–E4 | 🔴 | ✅ | API sobe local | 💡 ≤2026-09-29 |
| 4.1 | Login obrigatório (e-mail/senha + Google) | T4 | 🔴 | ✅ | Menu só após login | 💡 ≤2026-09-29 |
| 4.2 | Módulo de conta do usuário | T5 | 🟡 | ✅ | Tela `/conta` | 💡 ≤2026-09-29 |
| 4.3 | Papel de administrador e listagem de usuários | T6 | 🟡 | ✅ | `/admin` | 💡 ≤2026-09-29 |
| 4.4 | Exclusão de contas no admin | T6 | 🟢 | ✅ | Admin remove usuário | 💡 2026-09 |

## Fase 5: Desktop
| # | Tarefa | Itens | Prioridade | Status | Pronto quando | Concluída em |
|---|---|---|---|---|---|---|
| 5.1 | App Electron (Windows, NSIS, login via protocolo `webtools://`) | — | 🟡 | ✅ | `npm run dist` gera instalador | 💡 ≤2026-09-29 |

## Fase 6: Qualidade e entrega
| # | Tarefa | Itens | Prioridade | Status | Pronto quando | Concluída em |
|---|---|---|---|---|---|---|
| 6.1 | Trocar o deploy (Coolify) do site e da API para o repo `tiagomagno/webtools` (Base Directory do site vazio; da API `/server`) | — | 🔴 | ✅ | Site e API no ar a partir do repo novo; canonical correto, `401` sem token e CORS só para o site (login Google a conferir pelo usuário) | 2026-10-08 |
| 6.2 | Corrigir `SITE_URL` (era `https://webtools.local`) para o domínio real | — | 🔴 | ✅ | Canonical e OG com `webtools.tiagosmagno.com.br` (`seo.ts` e `layout.tsx`); `FRONTEND_URL` do exemplo da API ajustado | 2026-10-08 |
| 6.3 | Remover `ignoreBuildErrors` e zerar os erros de TypeScript (30 em 2026-10-08, ex.: `keywords` fora de `ToolMetaInput`, `title` em ícones lucide) | — | 🟡 | ✅ | `tsc --noEmit` sem erros e `next build` passa sem a flag (verificado; testar `/tools/pdf-compressor` no navegador) | 2026-10-08 |
| 6.4 | Adicionar Vitest e testar os utils puros | — | 🟡 | ✅ | `npm test` passa: 76 testes em 4 arquivos (finance, CPF/CNPJ/Luhn, hash/Base64, texto e CSV); `tsc` e `next build` seguem limpos. Achou e corrigiu bug no gerador de cartão (Luhn) | 2026-10-08 |
| 6.5 | Medir Lighthouse real (metas: Perf ≥95, SEO ≥95, A11y ≥90) | — | 🟢 | ✅ | Medido em produção na tela `/login` (única pública; as ferramentas redirecionam para ela): Perf 99 mobile / 100 desktop, SEO 100, A11y 93, Boas práticas 77. Ferramentas autenticadas não medidas (6.9). Detalhes em `DECISOES.md` | 2026-10-08 |
| 6.6 | Corrigir o `npm run lint` (ESLint 9 falhava ao carregar `next/core-web-vitals` via `FlatCompat`) | — | 🟡 | ✅ | `npm run lint` roda e reporta (246 arquivos: 42 erros e 44 avisos, ver 6.7); `eslint.config.mjs` no formato flat nativo do Next 16 | 2026-10-08 |
| 6.7 | Corrigir os 42 erros do lint | — | 🟡 | ✅ | `npm run lint`: 0 erros (65 avisos). 21 erros corrigidos (RegexTester, JwtDecoder, TimestampTool, QrReader, `const`, `any`, aspas em JSX). As regras `react-hooks/set-state-in-effect` e `react-hooks/refs` (21 casos) ficaram como aviso, com justificativa em `eslint.config.mjs` | 2026-10-08 |
| 6.8 | Acessibilidade e boas práticas do login e do avatar: `icon.svg` (favicon), `<main>`, tokens `--accent-strong` e `--accent-text` (contraste ≥4,5) | T4 | 🟡 | ✅ | Login local: A11y 100 (era 93), sem erro de console e com landmark `<main>`; avatar do menu corrigido. Falta confirmar em produção após o deploy | 2026-10-08 |
| 6.9 | Medir Lighthouse das ferramentas autenticadas (home e 2 ferramentas) | T1, T2 | 🟢 | ✅ | Medido em build local com API de mentira e sessão fictícia: Perf 100, SEO 100, A11y 96–100, Boas práticas 81 (celular e desktop). Detalhes em `DECISOES.md` | 2026-10-08 |

Fluxo contínuo: novas ferramentas pequenas entram como tarefa nova (fase 2, ID seguinte), uma por conversa.
