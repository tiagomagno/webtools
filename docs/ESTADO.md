> **Atualizado** 2026-10-08 · **Fase** 6 (Qualidade e entrega) · **Progresso** 23/25 (92%)

## 🎯 Onde estamos
- ✅ Catálogo de ferramentas completo (roadmap 100/100), login, admin, API e app Electron funcionando.
- ✅ Projeto em repo próprio e público (`tiagomagno/webtools`), deploy no Coolify (site na raiz, API em `/server`).
- ✅ Tipagem limpa: `tsc` com 0 erros e build sem `ignoreBuildErrors` (6.3).
- ✅ Testes: Vitest com 76 testes dos utils puros (`npm test`). Pegou e corrigiu um bug no gerador de cartão (Luhn) (6.4).
- ⚠️ As mudanças da 6.3 e da 6.4 estão **sem commit**.

## ➡️ Próximos passos
1. Testar no navegador: compressão de PDF (`/tools/pdf-compressor`, mudou a chamada do pdfjs na 6.3) e Gerador de Cartão (`/tools/gerador-cartao`, bug corrigido na 6.4).
2. 6.5 (Lighthouse real) e 6.6 (`npm run lint` quebrado).
3. Seguir com novas ferramentas pequenas, uma por conversa (com teste no util, conforme `.claude/rules/testing.md`).

## ⚠️ Atenção
- `FRONTEND_URL` da API (CORS e redirect do login Google) precisa ser exatamente `https://webtools.tiagosmagno.com.br` no Coolify.
- O build **falha** em erro de tipo: rodar `npx tsc --noEmit` e `npm test` antes de subir.
- `npm run lint` não roda (erro de configuração do ESLint, tarefa 6.6); não há lint automático por enquanto.
- Só os utils puros têm teste; componentes e login são validados por build e conferência manual.
- `project-management/` é local e está no `.gitignore` (de propósito). `PRODUTO.md` e `NEGOCIO.md` também são locais.
- Cloudflare com proxy ligado: o aviso "DNS mismatch" do Coolify é esperado e inofensivo; não desligar o proxy.

## ❓ Pendências em aberto
- Login com Google no ar (a conferir pelo usuário depois da troca de repo).
- Divergência de contagem: roadmap diz 100 ferramentas, `tools.ts` tem ~82 entradas e `src/app/tools` tem 84 pastas (as calculadoras foram unificadas).
- AdSense: citado no roadmap, mas não há integração no código.
