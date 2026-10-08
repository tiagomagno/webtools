---
paths:
  - "src/**/*.tsx"
---
# Interface mobile-first
- Projetar a partir de ~360 px; ampliar com `md:` e `lg:`.
- Usar apenas tokens (`var(--bg)`, `var(--accent)`...) e componentes existentes (ver docs/DESIGN.md); nada de cor ou espaçamento avulso.
- Respeitar tema claro/escuro (`data-theme`) e a escala de fonte (`data-font`).

## Checklist da tela
- [ ] Abre em 360 px sem rolagem lateral
- [ ] Áreas de toque de pelo menos 44 px
- [ ] Estados: vazio, carregando, erro e sucesso
- [ ] Só tokens e componentes do design system
- [ ] Funciona nos temas claro e escuro
- [ ] Textos em português do Brasil, tom direto
