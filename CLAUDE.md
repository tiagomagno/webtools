# Webtools
Site de ferramentas online do dia a dia (texto, dev, SEO, imagem, PDF, calculadoras), com conta de usuário, API Fastify e app desktop Electron. Novas ferramentas pequenas são criadas continuamente.

@docs/ESTADO.md

## Comandos
- Instalar: `npm install` · `npm --prefix server install` · `npm --prefix electron install`
- Rodar site: `npm run dev` · Rodar API: `npm --prefix server run dev` (porta 3333)
- Build: `npm run build` · Lint: `npm run lint` · Testes: ❓ (sem runner)
- Banco: `npm --prefix server run db:push` (produção: `db:migrate:deploy`)

## Documentação (ler antes de alterar algo relacionado)
- Arquitetura: docs/ARQUITETURA.md · Design: docs/DESIGN.md
- Tarefas: docs/TASKS.md · Decisões: docs/DECISOES.md
- Produto e Negócio: docs/PRODUTO.md, docs/NEGOCIO.md (**locais, fora do git**: podem não existir em outro clone)

## Fluxo de trabalho
- Uma conversa por tarefa. Comece lendo a tarefa em docs/TASKS.md e só os documentos relevantes; marque-a como 🔄.
- Ao concluir uma tarefa, **antes de declarar que terminou**: conferir o "pronto quando"; atualizar TASKS.md (✅, data, contadores) e o status dos itens cobertos; reescrever docs/ESTADO.md; registrar decisões novas em docs/DECISOES.md; sugerir commit com o ID da tarefa.
- Tarefa grande ou ambígua (fluxo crítico, regra de negócio nova, vários módulos): antes de implementar, criar a spec em docs/tarefas/<id>.md (objetivo sem tecnologia, critérios de aceite verificáveis, dúvidas ❓), resolver as dúvidas com o usuário e só então planejar e implementar.
- Trabalho novo que surgir no meio vira tarefa nova com ID novo; não infle a tarefa atual.
- Entregas que o usuário vê só ficam ✅ depois que ele testou.
- Não invente: o que não se sabe fica ❓ em ESTADO.md.

## Convenções do projeto
- Nova ferramenta: pasta `src/app/tools/<slug>/` com `page.tsx` (server, usa `ToolPage` + `toolMetadata`) e um componente `"use client"`; lógica em `src/app/lib/*.ts`; registrar em `src/app/lib/tools.ts`. Slugs em português.
- Não adicionar dependências sem autorização do usuário.
- Git: não criar branch, commit nem PR sem pedido explícito; nunca versionar `.env`, `project-management/`, `docs/PRODUTO.md` ou `docs/NEGOCIO.md`.
