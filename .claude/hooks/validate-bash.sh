#!/usr/bin/env bash
# PreToolUse (Bash): recebe o JSON do evento no stdin e bloqueia padrões perigosos.
input="$(cat)"
patterns=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \*"
  "git push --force"
  "git push -f"
  "DROP DATABASE"
  "DROP TABLE"
  "mkfs"
  "chmod -R 777 /"
)
for p in "${patterns[@]}"; do
  if printf '%s' "$input" | grep -qiF -- "$p"; then
    echo "Bloqueado pelo hook validate-bash: comando contém '$p'. Confirme com o usuário antes de prosseguir." >&2
    exit 2
  fi
done
exit 0
