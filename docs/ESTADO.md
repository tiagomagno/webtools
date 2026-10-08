> **Atualizado** 2026-10-08 · **Fase** 6 (Qualidade e entrega) · **Progresso** 20/24 (83%)

## 🎯 Onde estamos
- ✅ Catálogo de ferramentas completo (roadmap 100/100), login, admin, API e app Electron funcionando.
- ✅ Projeto separado do portfolio em repo próprio (`tiagomagno/webtools`, privado), com os 32 commits.
- 🔄 6.1: o deploy do site ainda puxa do repo do portfolio; falta trocar na hospedagem (feito pelo usuário no painel; pasta raiz deve ficar vazia).

## ➡️ Próximos passos
1. Concluir 6.1 (trocar o repo no Coolify e conferir o `FRONTEND_URL` da API) e, depois, 6.3 (erros de TypeScript).
2. Seguir com novas ferramentas pequenas, uma por conversa.

## ⚠️ Atenção
- `FRONTEND_URL` da API (CORS e redirect do login Google) precisa ser exatamente `https://webtools.tiagosmagno.com.br` no Coolify; o `.env.example` já está assim.
- Mudanças de 2026-10-08 (`SITE_URL`, `.env.example`, docs, `.claude/`) estão **sem commit**.
- `next.config.ts` tem `typescript.ignoreBuildErrors: true`: há 30 erros de tipo que não quebram o build (tarefa 6.3).
- Não há runner de testes; mudanças são validadas por `next build` e conferência manual.
- `project-management/` é local e está no `.gitignore` (de propósito). `PRODUTO.md` e `NEGOCIO.md` também são locais.
- O código local da raiz tem `.next` antigo com caminhos do portfolio; se o dev server estranhar, apague `.next`.

## ❓ Pendências em aberto
- Onde roda o servidor do Coolify e onde fica o DNS de `tiagosmagno.com.br`? (não está na Hostinger)
- Divergência de contagem: roadmap diz 100 ferramentas, `tools.ts` tem ~82 entradas e `src/app/tools` tem 84 pastas (as calculadoras foram unificadas).
- AdSense: citado no roadmap, mas não há integração no código.
