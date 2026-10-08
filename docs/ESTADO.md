> **Atualizado** 2026-10-08 · **Fase** 6 (Qualidade e entrega) · **Progresso** 21/24 (88%)

## 🎯 Onde estamos
- ✅ Catálogo de ferramentas completo (roadmap 100/100), login, admin, API e app Electron funcionando.
- ✅ Projeto em repo próprio e público (`tiagomagno/webtools`), com o histórico do webtools (32 commits).
- ✅ Deploy no Coolify a partir do repo novo: site em `webtools.tiagosmagno.com.br` (raiz) e API em `api.tiagosmagno.com.br` (`/server`). Canonical e Open Graph com o domínio real.

## ➡️ Próximos passos
1. 6.3: zerar os erros de TypeScript e remover `ignoreBuildErrors`.
2. Seguir com novas ferramentas pequenas, uma por conversa.

## ⚠️ Atenção
- `FRONTEND_URL` da API (CORS e redirect do login Google) precisa ser exatamente `https://webtools.tiagosmagno.com.br` no Coolify.
- `next.config.ts` tem `typescript.ignoreBuildErrors: true`: há 30 erros de tipo que não quebram o build (tarefa 6.3).
- Não há runner de testes; mudanças são validadas por `next build` e conferência manual.
- `project-management/` é local e está no `.gitignore` (de propósito). `PRODUTO.md` e `NEGOCIO.md` também são locais.
- Cloudflare com proxy ligado: o aviso "DNS mismatch" do Coolify é esperado e inofensivo; não desligar o proxy.
- O `.next` local pode ter caminhos do portfolio; se o dev server estranhar, apague `.next`.

## ❓ Pendências em aberto
- Login com Google no ar (a conferir pelo usuário depois da troca de repo).
- Divergência de contagem: roadmap diz 100 ferramentas, `tools.ts` tem ~82 entradas e `src/app/tools` tem 84 pastas (as calculadoras foram unificadas).
- AdSense: citado no roadmap, mas não há integração no código.
