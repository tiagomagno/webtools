# ✅ Tasks: Webtools
> Tarefas reconstruídas do histórico do Git e do roadmap antigo (marcadas 💡 até você confirmar) mais as pendentes.

| Versão | Atualizado em | Status | Fase atual |
|---|---|---|---|
| 0.1 | 2026-10-08 | 📝 Rascunho | 6 (Qualidade e entrega) |

> **Total** 24 · **Concluídas** 20 (83%) · **Em andamento** 1

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
| 6.1 | Trocar o deploy (Coolify) do site e da API para o repo `tiagomagno/webtools` (Base Directory do site vazio; da API `/server`) | — | 🔴 | 🔄 | `webtools.tiagosmagno.com.br` no ar a partir do repo novo, login com Google funcionando | — |
| 6.2 | Corrigir `SITE_URL` (era `https://webtools.local`) para o domínio real | — | 🔴 | ✅ | Canonical e OG com `webtools.tiagosmagno.com.br` (`seo.ts` e `layout.tsx`); `FRONTEND_URL` do exemplo da API ajustado | 2026-10-08 |
| 6.3 | Remover `ignoreBuildErrors` e zerar os erros de TypeScript (30 em 2026-10-08, ex.: `keywords` fora de `ToolMetaInput`, `title` em ícones lucide) | — | 🟡 | ⬜ | `tsc --noEmit` sem erros e `next build` passa sem a flag | — |
| 6.4 | Adicionar Vitest e testar os utils puros (precisa de autorização) | — | 🟡 | ⬜ | Utils críticos cobertos; ver `DECISOES.md` | — |
| 6.5 | Medir Lighthouse real (metas: Perf ≥95, SEO ≥95, A11y ≥90) | — | 🟢 | ⬜ | Valores medidos registrados | — |

Fluxo contínuo: novas ferramentas pequenas entram como tarefa nova (fase 2, ID seguinte), uma por conversa.
