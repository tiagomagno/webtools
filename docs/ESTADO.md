> **Atualizado** 2026-10-08 · **Fase** 7 (Acesso aberto e histórico) · **Progresso** 30/33 (91%)

## 🎯 Onde estamos
- ✅ Catálogo de ferramentas completo (roadmap 100/100), login (e-mail e Google, confirmado em produção pelo usuário), admin, API e app Electron funcionando.
- ✅ Projeto em repo próprio e público (`tiagomagno/webtools`), deploy no Coolify (site na raiz, API em `/server`).
- ✅ Qualidade: `tsc` 0 erros, 83 testes (`npm test`), `npm run lint` 0 erros.
- ✅ **Em produção (commit `83df1cf`):** ferramentas abertas sem login (HTML com `<h1>` e JSON-LD, sem "Carregando…"), `Entrar` com retorno à ferramenta, favicon, `<main>` no login, `/conta` e `/admin` protegidos. Lighthouse em produção: `/login` 99/100 · 100 · 100 · 81 e ferramenta 98/100 · 100 · 100/96 · 81 (Perf · SEO · A11y · Boas práticas; celular/desktop). O 81 é só o script de desafio da Cloudflare.
- ✅ A API continua respondendo (`401` sem token). O deploy da API não mudou de código nesta leva.
- 🔄 **7.4 implementada, não publicada:** `src/app/sitemap.ts` (home, 5 categorias e as ferramentas de `tools.ts`) e `src/app/robots.ts` (bloqueia `/conta`, `/admin`, `/login`, `/auth`). `tsc`, lint e build ok; saída conferida no build local.
- 🔄 **7.14 em teste:** Home refeita no visual novo (sem lucide): busca, cartões de categoria com canto cortado (contagem + primeiras ferramentas) e últimas ferramentas. Calculadoras: seletor de tipo agrupado por assunto no canto direito do título (placeholder "Selecione o tipo de calculadora"; `?tipo=` continua). Dentro das ferramentas de Dev, Utilidades, Finanças, Marketing e Calculadoras só a moldura é nova (cabeçalho, abas, fundo); os boxes internos ainda estão no estilo antigo (raio 10–14 px, sem `.cut-box`).
- 🔄 **7.13 em teste:** Utilidades (32 → 10) e Finanças (8 → 3) agrupadas com abas sublinhadas: Analisador de Texto, Editor de Texto, Codificações de Texto, Extrator de Documentos, Ferramentas de PDF, QR Code, Geradores, Documentos BR (Comparador e Cronômetro ficam soltos; Área e Tinta virou aba de Calculadoras, que agora escolhe a calculadora num menu agrupado por assunto: Tempo e datas, Dinheiro, Números, Conversores, Saúde, Casa e Carro) e Trabalho e Impostos, Imóveis, Investimentos. 41 URLs antigas redirecionam (308). tsc, lint (0 erros) e 179 testes ok; falta testar cada aba. As 4 páginas monolíticas (PDF Extractor, PDF Compressor, Documento→Markdown, Área e Tinta) viraram componentes sem cabeçalho.
- 🔄 **7.12 em teste:** Dev unificado de 17 para 5 ferramentas com abas sublinhadas (`ToolTabs`, aba em `?tipo=`): Formatador de Dados e Código (JSON · SQL/HTML/CSS/XML · CSV ↔ JSON · Markdown → HTML), Codificadores (Base64 · URL · JWT), Hash e UUID (Hash · UUID v4 · UUID em massa), Conversores Técnicos (Bases · Timestamp · ASCII · Unidades CSS), Regex e Cron. As 17 URLs antigas redirecionam (308) para a aba certa. tsc, lint (0 erros) e 179 testes ok; falta o usuário testar cada aba e o build final. Os componentes internos mantêm as abas antigas (JSON e Código): visual interno ainda não refeito.
- 🔄 **7.11 em teste:** Criador de Moodboard refeito: Branding/App Mobile/Website viram o menu Presets do título do board; boxes Branding (logo + fundo), Prints/Telas (cada envio vai para a próxima área vazia) e propriedades compactas; qualquer bloco com texto aceita imagem. Design agora está todo no layout novo.
- 🔄 **7.10 em teste:** Editor de Imagem numa página só (caixas Redimensionar, Cortar e Aumentar com Desfazer/Original; menu Exportar com PNG, JPG, WebP e Base64; Colar Base64); Conversor de Imagens saiu do menu e redireciona; Layouts e Gerador de Favicon refeitos no estilo novo. Falta o Criador de Moodboard. 179 testes, tsc e build ok; falta testar com arquivos reais (HEIC, corte, compressão).
- 🔄 **7.9 em teste:** Gerador de Gradientes refeito (duas colunas 50/50, OKLCH, cortes secos, barra de cores com opacidade, presets, 6 animações, exportar CSS/Tailwind/SVG/PNG). Padrões e mesh ficam para a próxima etapa.
- 🔄 **7.8 em teste:** Paleta de Cores refeita (modos Cor base/Imagem/Roda, harmonias em ícones, 5 cores com copiar, ações no topo, preview claro/escuro). Conversor de Cores (valores RGB/HSL abaixo de cada cor) e Extrator viraram parte dela. 127 testes (23 novos em `palette.test.ts`), tsc, lint e build ok; falta testar com imagem real e o usuário aprovar.
- 🔄 **7.7 em teste:** Design agora tem 9 ferramentas: Conversor de Imagens e Editor de Imagem (novo) com abas, Extrator dentro da Paleta; 10 URLs antigas redirecionam (308). `tsc`, 104 testes e build ok; falta testar com arquivos reais. BMP ficou de fora do conversor (❓).
- 🔄 **7.6 em teste:** cabeçalho global (`SiteHeader`) no lugar da sidebar no desktop, fundo pontilhado discreto (tokens `--page-bg`/`--page-dot`) e Contraste de Cores no layout do Figma, responsivo. Fontes novas (Plus Jakarta Sans, Kode Mono) só no cabeçalho e nessa página. Mobile não mudou. `tsc`, 104 testes e build ok; falta o usuário aprovar o visual.
- 🔄 **7.2 implementada, não publicada:** botão "Salvar no histórico" no Gerador de QR, Conversor de Cores e Paleta de Cores; seção "Meu histórico" em `/conta` (filtro, carregar mais, apagar, reabrir). 104 testes, tsc, lint e build ok; falta testar logado.

## ➡️ Próximos passos
1. **Testes manuais do usuário em produção:** entrar com Google a partir de uma ferramenta e conferir que volta a ela; `/conta` deslogado vai ao login; `/tools/pdf-compressor`, `/tools/gerador-cartao`, `/tools/regex-tester`, `/tools/jwt-decoder`, `/tools/leitor-qr`.
2. Commitar e publicar **7.4** e **7.2** (deploy manual no Coolify do site; a API não mudou). Conferir `/sitemap.xml`, `/robots.txt` e, logado, o fluxo salvar → `/conta` → reabrir. Depois, **7.3** (pede decisão de layout).
3. Opcional: ligar o webhook do GitHub no Coolify para o deploy ser automático.

## ⚠️ Atenção
- **Deploy do Coolify é manual** (origem "Manual"): `git push` não publica; clicar em Deploy no site e na API, ou ligar o webhook do GitHub (Webhooks do recurso no Coolify + Settings > Webhooks no repo, evento `push`).
- `FRONTEND_URL` da API (CORS e redirect do login Google) precisa ser exatamente `https://webtools.tiagosmagno.com.br` no Coolify.
- O build **falha** em erro de tipo: rodar `npx tsc --noEmit`, `npm test` e `npm run lint` antes de subir. Mudou o build? Teste num clone limpo (`git clone` do GitHub, `npm ci`, `npm run build`): a pasta de trabalho tem `node_modules` de `electron/` e `server/` que o Coolify não tem (o `tsconfig` da raiz já os exclui).
- Lint: `react-hooks/set-state-in-effect` e `react-hooks/refs` são avisos de propósito (ver `eslint.config.mjs`).
- Medir Lighthouse **neste computador** dá nota falsa: o Kaspersky injeta ~850 KiB de JS/CSS (Perf cai de 99 para 66). Bloquear `*kaspersky-labs.com*`.
- Medir as ferramentas por dentro: usar build local com `NEXT_PUBLIC_API_URL=http://localhost:3333`, uma API de mentira (`/auth/refresh`, `/me`, `/history`) e o token fictício em `localStorage` (`wt-auth-tokens`). Nunca usar credenciais reais nem criar usuário em produção. No Git Bash usar `MSYS_NO_PATHCONV=1` ao passar caminhos `/...`.
- Só os utils puros têm teste; componentes e login são validados por build e conferência manual.
- `project-management/`, `docs/PRODUTO.md` e `docs/NEGOCIO.md` são locais (no `.gitignore`, de propósito).
- Cloudflare com proxy ligado: o aviso "DNS mismatch" do Coolify é esperado e inofensivo; não desligar o proxy.

## ❓ Pendências em aberto
- **SEO do conteúdo (7.3):** o HTML tem `<h1>`, `WebApplication` e `BreadcrumbList`, mas o texto explicativo, o FAQ e as relacionadas não são renderizados (o `ToolPage` os ignora de propósito) e não há JSON-LD `FAQPage`. Decisão do usuário: como e onde mostrar.
- Histórico (7.2): quais ferramentas devem guardar entrada e como a página de histórico deve ser.
- Boas práticas 81 em produção vem do script de desafio da Cloudflare (`/cdn-cgi/challenge-platform`); só mudaria nas configurações da Cloudflare, se o usuário quiser.
- Acessibilidade residual (dentro da meta): cor roxa de categoria na barra lateral (contraste 3,25) e nome acessível do botão do menu de usuário.
- Divergência de contagem: roadmap diz 100 ferramentas, `tools.ts` tem ~82 entradas e `src/app/tools` tem 84 pastas (as calculadoras foram unificadas).
- AdSense: citado no roadmap, mas não há integração no código.
