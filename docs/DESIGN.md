# 🎨 Design: Webtools
> Interface de dashboard densa, rápida e acessível, com tema claro/escuro e escala de fonte ajustável.

| Versão | Atualizado em | Status | Fase atual |
|---|---|---|---|
| 0.1 | 2026-10-08 | 📝 Rascunho (reconstruído do código) | 6 |

Legenda: ✅ confirmado · 💡 hipótese · ❓ em aberto

## 1. Princípios de UX
- Resolver a tarefa na primeira tela, sem cadastro de dados na própria ferramenta. 💡
- Tudo roda no navegador; deixar isso claro nas FAQs (já é padrão nas páginas). ✅
- Consistência: toda ferramenta usa o shell `ToolPage` (hero, conteúdo, FAQ, relacionadas, CTA). ✅

## 2. Contexto de uso
Pessoas comuns resolvendo tarefas pontuais do dia a dia (contar texto, converter imagem, calcular), em desktop e celular. 💡

## 3. Mobile-first
- Layout dedicado: `MobileLayout`/`MobileHeader` com bottom nav de 5 ícones personalizáveis. ✅
- Projetar a partir de ~360 px; ampliar com `md:` e `lg:`. Áreas de toque de 44 px; sem depender de hover.
- Estados em toda tela: vazio, carregando, erro, sucesso.
- Tom de voz: português do Brasil, direto, sem jargão. 💡

## 4. Mapa de telas
| ID | Tela | Rota | Status |
|---|---|---|---|
| T1 | Home / dashboard | `/` | ✅ |
| T2 | Página de ferramenta (84 pastas em `src/app/tools`) | `/tools/<slug>` | ✅ |
| T3 | Categoria | `/categoria/[slug]` | ✅ |
| T4 | Login | `/login` (+ `/auth/callback`) | ✅ |
| T5 | Conta | `/conta` | ✅ |
| T6 | Admin (usuários) | `/admin` | ✅ |

## 5. Design system
- **Origem:** código. Tokens como variáveis CSS em `src/app/globals.css` (sem `tailwind.config`; Tailwind 4). ✅
- **Regra de ouro:** usar `var(--token)`; nada de cor avulsa. Foco visível e `prefers-reduced-motion` já tratados globalmente. ✅

### Paleta (fonte oficial: `globals.css`)
| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--bg` | #ffffff | #080808 | Fundo da página |
| `--surface` / `--surface-2` | #ffffff / #f4f5f7 | #111111 / #1a1a1a | Cartões e áreas secundárias |
| `--border` | #e5e7eb | #242424 | Bordas |
| `--accent` / `--accent-dim` | #6366f1 / #4f46e5 | igual | Destaque, foco, seleção |
| `--text` / `--text-muted` / `--text-subtle` | #111 / #52606d / #6b7280 | #f4f4f5 / #9a9aa2 / #7d7d86 | Texto |

### Tipografia
| Papel | Família | Tamanho | Peso |
|---|---|---|---|
| Corpo e títulos | Inter (fallback system-ui) | 13 / 15 / 17 px via `data-font` sm/md/lg (preferência salva em `localStorage` `wt-font`) | ❓ |

### Componentes
| Componente | Onde fica |
|---|---|
| ToolPage (shell server) | `src/app/components/ToolPage.tsx` |
| AppShell, MobileLayout, MobileHeader | `src/app/components/` |
| Breadcrumbs, ContentHeader | `src/app/components/` |
| FavoritesMenu / FavoritesConfigModal | `src/app/components/` |
| FormatConverter, Base64Tool, CsvJsonTool (compartilhados por prop `mode`) | `src/app/components/` |

## 6. Referências
- Figma: ❓ · Identidade da marca: ❓
