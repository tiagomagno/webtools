> **Atualizado** 2026-10-08 · **Fase** 6 (Qualidade e entrega) · **Progresso** 28/28 (100%)

## 🎯 Onde estamos
- ✅ Catálogo de ferramentas completo (roadmap 100/100), login, admin, API e app Electron funcionando.
- ✅ Projeto em repo próprio e público (`tiagomagno/webtools`), deploy no Coolify (site na raiz, API em `/server`).
- ✅ Qualidade: `tsc` 0 erros, build sem `ignoreBuildErrors`, 76 testes (`npm test`) e `npm run lint` com 0 erros (65 avisos).
- ✅ Lighthouse (build local, sessão fictícia): ferramentas com Perf 100, SEO 100, A11y 96–100, Boas práticas 81. Login: A11y 100.
- ⚠️ **Nada da 6.3 em diante foi enviado ao GitHub** (4 commits locais) e as mudanças da 6.5–6.9 estão **sem commit**. O push dispara deploy no Coolify.

## ➡️ Próximos passos
1. Commitar e enviar (ver `DECISOES.md` e a conversa); depois conferir em produção: `/login` (favicon, `<main>`, contraste) e os testes manuais abaixo.
2. Testar no navegador: `/tools/pdf-compressor` (pdfjs mudou na 6.3), `/tools/gerador-cartao` (bug do Luhn corrigido na 6.4), `/tools/regex-tester`, `/tools/jwt-decoder` e `/tools/leitor-qr` (corrigidos na 6.7).
3. Decidir o SEO das ferramentas (pendência abaixo) e seguir com novas ferramentas, uma por conversa.

## ⚠️ Atenção
- `FRONTEND_URL` da API (CORS e redirect do login Google) precisa ser exatamente `https://webtools.tiagosmagno.com.br` no Coolify.
- O build **falha** em erro de tipo: rodar `npx tsc --noEmit`, `npm test` e `npm run lint` antes de subir.
- Lint: `react-hooks/set-state-in-effect` e `react-hooks/refs` são avisos de propósito (ver `eslint.config.mjs`); 21 casos pedem refatoração por ferramenta, com teste no navegador.
- Medir Lighthouse **neste computador** dá nota falsa: o Kaspersky injeta ~850 KiB de JS/CSS (Perf cai de 99 para 66). Bloquear `*kaspersky-labs.com*`. A nota de Boas práticas 81 local vem de um script http do próprio Kaspersky.
- Medir as ferramentas por dentro exige sessão: usar build local com `NEXT_PUBLIC_API_URL` apontando para uma API de mentira (`/auth/refresh`, `/me`) e o token fictício em `localStorage` (`wt-auth-tokens`). Nunca usar credenciais reais.
- Só os utils puros têm teste; componentes e login são validados por build e conferência manual.
- `project-management/` é local e está no `.gitignore` (de propósito). `PRODUTO.md` e `NEGOCIO.md` também são locais.
- Cloudflare com proxy ligado: o aviso "DNS mismatch" do Coolify é esperado e inofensivo; não desligar o proxy.

## ❓ Pendências em aberto
- **SEO x login obrigatório (confirmado):** para quem não tem sessão, o HTML de uma ferramenta traz só `Carregando…`: sem `<h1>`, sem FAQ, com apenas `<title>` e JSON-LD. Googlebot executa JS, mas o `AuthGate` redireciona para `/login`. O conteúdo de SEO das ferramentas provavelmente não é indexado. Decisão do usuário: manter login obrigatório, ou abrir as páginas das ferramentas?
- Acessibilidade residual (já dentro da meta): cor roxa de categoria na barra lateral (contraste 3,25) e nome acessível do botão do menu de usuário (`label-content-name-mismatch`).
- Login com Google no ar (a conferir pelo usuário depois da troca de repo).
- Divergência de contagem: roadmap diz 100 ferramentas, `tools.ts` tem ~82 entradas e `src/app/tools` tem 84 pastas (as calculadoras foram unificadas).
- AdSense: citado no roadmap, mas não há integração no código.
