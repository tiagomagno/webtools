# Testes
❓ O projeto **não tem runner de testes** (decisão de 2026-06-21, ver docs/DECISOES.md). Até a tarefa 6.4 ser autorizada:
- Validar com `npm run build` (e `npm run lint`) e conferência manual da lógica nos utils de `src/app/lib`.
- Não instalar Vitest/Jest sem autorização do usuário.
- Quando o runner existir: utils puros ficam co-locados ou em `__tests__`, e fluxos críticos (login) ganham teste ponta a ponta como tarefa separada.
