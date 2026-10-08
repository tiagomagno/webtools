> **Atualizado** 2026-10-08 · **Fase** 7 (Acesso aberto e histórico) · **Progresso** 29/33 (88%)

## 🎯 Onde estamos
- ✅ Catálogo de ferramentas completo (roadmap 100/100), login (e-mail e Google, confirmado em produção pelo usuário), admin, API e app Electron funcionando.
- ✅ Projeto em repo próprio e público (`tiagomagno/webtools`), deploy no Coolify (site na raiz, API em `/server`).
- ✅ Qualidade (fase 6 completa): `tsc` 0 erros, 83 testes (`npm test`), `npm run lint` 0 erros, Lighthouse local 100/100/96–100.
- ✅ **7.1 (código):** as ferramentas agora são abertas, sem login; só `/conta` e `/admin` exigem conta. Sem sessão aparece "Entrar" (volta à ferramenta depois). Histórico só com conta. Verificado em build local.
- ⚠️ **A produção está desatualizada:** roda o commit `d7e5a1a`. Os commits da fase 6 até `bdfa4e1` estão no GitHub mas **não foram publicados** (deploy no Coolify é manual); a 7.1 está **sem commit**.

## ➡️ Próximos passos
1. **Commitar a 7.1** (arquivos: `AppChrome`, `AuthGate`, `ContentHeader`, `MobileUserMenu`, `login/page`, `auth/callback`, `lib/auth/next.ts`, `useToolHistory`, teste `auth-next`, docs, `CLAUDE.md`) e **publicar (7.5)**: Deploy manual no site e na API do Coolify.
2. Depois de publicar, testar em produção: ferramenta sem login; Entrar com Google voltando à ferramenta; `/conta` deslogado; favicon na aba; `/tools/pdf-compressor`, `/tools/gerador-cartao`, `/tools/regex-tester`, `/tools/jwt-decoder`, `/tools/leitor-qr`.
3. 7.2 (histórico de verdade: nenhuma ferramenta usa `useToolHistory` ainda; pede spec), 7.3 (SEO do conteúdo) e 7.4 (sitemap/robots).

## ⚠️ Atenção
- **Deploy do Coolify é manual** (origem "Manual" no histórico). `git push` sozinho não publica; clicar em Deploy no site e na API, ou ligar o webhook.
- `FRONTEND_URL` da API (CORS e redirect do login Google) precisa ser exatamente `https://webtools.tiagosmagno.com.br` no Coolify.
- O build **falha** em erro de tipo: rodar `npx tsc --noEmit`, `npm test` e `npm run lint` antes de subir.
- Lint: `react-hooks/set-state-in-effect` e `react-hooks/refs` são avisos de propósito (ver `eslint.config.mjs`).
- Medir Lighthouse **neste computador** dá nota falsa: o Kaspersky injeta ~850 KiB de JS/CSS (Perf cai de 99 para 66). Bloquear `*kaspersky-labs.com*`.
- Medir as ferramentas por dentro: usar build local com `NEXT_PUBLIC_API_URL=http://localhost:3333`, uma API de mentira (`/auth/refresh`, `/me`, `/history`) e o token fictício em `localStorage` (`wt-auth-tokens`). Nunca usar credenciais reais nem criar usuário em produção. No Git Bash usar `MSYS_NO_PATHCONV=1` ao passar caminhos `/...`.
- Só os utils puros têm teste; componentes e login são validados por build e conferência manual.
- `project-management/`, `docs/PRODUTO.md` e `docs/NEGOCIO.md` são locais (no `.gitignore`, de propósito).
- Cloudflare com proxy ligado: o aviso "DNS mismatch" do Coolify é esperado e inofensivo; não desligar o proxy.

## ❓ Pendências em aberto
- **SEO do conteúdo (7.3):** mesmo com a página aberta, o HTML só traz `<h1>`, `WebApplication` e `BreadcrumbList`. O texto explicativo, o FAQ e as relacionadas não são renderizados (o `ToolPage` os ignora de propósito) e não há JSON-LD `FAQPage`. Decisão do usuário: como e onde mostrar.
- Histórico (7.2): quais ferramentas devem guardar entrada e como a página de histórico deve ser.
- Acessibilidade residual (dentro da meta): cor roxa de categoria na barra lateral (contraste 3,25) e nome acessível do botão do menu de usuário.
- Divergência de contagem: roadmap diz 100 ferramentas, `tools.ts` tem ~82 entradas e `src/app/tools` tem 84 pastas (as calculadoras foram unificadas).
- AdSense: citado no roadmap, mas não há integração no código.
