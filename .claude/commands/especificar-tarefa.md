---
description: Cria a spec leve de uma tarefa grande ou ambígua antes de implementar
argument-hint: [id da tarefa, ex.: 6.4]
---
Crie a spec da tarefa $ARGUMENTS em docs/tarefas/$ARGUMENTS.md. Não implemente nada.
1. Leia a linha da tarefa em docs/TASKS.md e os documentos relevantes (PRODUTO, NEGOCIO, DESIGN, ARQUITETURA).
2. Escreva primeiro o objetivo ("Como <ator>, quero <ação>, para <resultado>") e os critérios de aceite ("Dado..., quando..., então..."), **sem citar tecnologia**. Cada critério deve ser observável e testável; cite o ID da regra de negócio quando houver (RN3).
3. Liste o que ainda não se sabe como ❓ e pergunte ao usuário, até 3 perguntas por vez. Não planeje enquanto houver ❓ que mude o resultado.
4. Só depois, escreva o plano curto (módulos e arquivos afetados, abordagem, riscos) e as subtarefas (ex.: $ARGUMENTSa, $ARGUMENTSb).
5. Defina a verificação: o que é automático, o que o usuário confere manualmente.
6. Estrutura do arquivo: 1 Objetivo · 2 Critérios de aceite · 3 Fora do escopo · 4 Dúvidas · 5 Plano · 6 Subtarefas · 7 Verificação · 8 Resultado (vazio até concluir).
7. Em docs/TASKS.md, troque o "pronto quando" da tarefa por "ver spec". Peça a validação da spec antes de começar.
