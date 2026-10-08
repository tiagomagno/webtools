# Regras gerais
- Ler a documentação (ARQUITETURA, DESIGN) antes de mudar algo relacionado.
- Mudanças pequenas e focadas; não mexer em arquivos não relacionados.
- Reaproveitar componentes, utilitários e serviços em vez de duplicar (ex.: `ToolPage`, `FormatConverter`, utils em `src/app/lib`).
- Não criar pastas novas sem motivo claro e sem registrar em docs/ARQUITETURA.md.
- Código autoexplicativo, com nomes significativos.
- Validar entradas em cliente e servidor; nunca gravar segredos no código.
- Não adicionar dependências sem autorização do usuário.
