---
description: Confere a consistência entre documentos, specs e tarefas (somente leitura)
argument-hint: [id da tarefa, opcional]
---
Faça uma análise **somente leitura**; não altere arquivos.
- Com id ($ARGUMENTS): confira a spec docs/tarefas/$ARGUMENTS.md contra PRODUTO, NEGOCIO, DESIGN e ARQUITETURA, antes de implementar.
- Sem id: confira o projeto inteiro.
Verifique:
- Funcionalidades do MVP (PRODUTO.md) cobertas por tarefas em TASKS.md, e tarefas sem funcionalidade correspondente.
- Regras de NEGOCIO.md refletidas nos critérios de aceite das specs.
- Telas do mapa de DESIGN.md com tarefa associada.
- Stack e pastas dos planos coerentes com ARQUITETURA.md.
- Contadores e status de TASKS.md coerentes com ESTADO.md.
- Itens ❓ que bloqueiam as próximas tarefas.
- Contradições entre documentos.
Entregue um relatório por gravidade (bloqueia / atenção / sugestão), com arquivo e trecho de cada achado e as perguntas que o usuário precisa responder.
