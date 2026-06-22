# Métricas — WEBTOOLS

> Metas por ferramenta (Lighthouse): Performance ≥95 · SEO ≥95 · Acessibilidade ≥90.
> Lighthouse exige ambiente de runtime; valores abaixo são metas/estimativas até medição real.

## Build atual
- **26 rotas**, todas prerenderizadas como estáticas (○ Static).
- **0 erros, 0 avisos** no `next build`.
- Sem dependências novas adicionadas (apenas APIs nativas: Web Crypto, TextEncoder, crypto.randomUUID).

| # | Ferramenta | Build | JS cliente | SEO (meta+JSON-LD) | A11y | Medido |
|---|------------|-------|-----------|--------------------|------|--------|
| 1 | contador-palavras | ✅ | 1 comp | ✅ 3× JSON-LD | labels/aria | estimado |
| 2 | contador-caracteres | ✅ | 1 comp | ✅ 3× JSON-LD | labels | estimado |
| 3 | tempo-leitura | ✅ | 1 comp | ✅ 3× JSON-LD | labels | estimado |
| 4 | comparador-textos | ✅ | 1 comp | ✅ 3× JSON-LD | labels | estimado |
| 5 | removedor-linhas | ✅ | 1 comp | ✅ 3× JSON-LD | labels | estimado |
| 6 | json-formatter | ✅ | 1 comp | ✅ 3× JSON-LD | aria-label | estimado |
| 7 | json-validator | ✅ | 1 comp | ✅ 3× JSON-LD | aria-label | estimado |
| 8 | json-diff | ✅ | 1 comp | ✅ 3× JSON-LD | aria-label | estimado |
| 9 | sql-formatter | ✅ | 1 comp | ✅ 3× JSON-LD | aria-label | estimado |
| 10 | base64-encode | ✅ | 1 comp | ✅ 3× JSON-LD | labels | estimado |
| 11 | base64-decode | ✅ | 1 comp | ✅ 3× JSON-LD | labels | estimado |
| 12 | jwt-decoder | ✅ | 1 comp | ✅ 3× JSON-LD | aria-label | estimado |
| 13 | uuid-generator | ✅ | 1 comp | ✅ 3× JSON-LD | labels | estimado |
| 14 | hash-generator | ✅ | 1 comp | ✅ 3× JSON-LD | labels | estimado |

## Observações
- Arquitetura server-first via `ToolPage`: HTML indexável (hero, conteúdo, FAQ, relacionadas) renderizado no servidor; JS de cliente restrito à ferramenta interativa.
- Reaproveitamento alto: 7 utils puros + 2 componentes compartilhados servem as 14 ferramentas.
- Pendente: medição real de Lighthouse em runtime (requer `npm start` + análise).
