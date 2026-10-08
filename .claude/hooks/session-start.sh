#!/usr/bin/env bash
# SessionStart: o que for escrito no stdout entra como contexto da conversa.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
if [ -f docs/TASKS.md ]; then
  em_andamento="$(grep '^|.*🔄' docs/TASKS.md | head -n 10)"
  if [ -n "$em_andamento" ]; then
    echo "Tarefas em andamento (docs/TASKS.md):"
    echo "$em_andamento"
  fi
fi
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  alteracoes="$(git status --short | head -n 15)"
  if [ -n "$alteracoes" ]; then
    echo "Alterações não commitadas:"
    echo "$alteracoes"
  fi
fi
exit 0
