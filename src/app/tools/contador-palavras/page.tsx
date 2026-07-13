import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import WordCounter from "./WordCounter";

const DESCRIPTION =
  "Conte palavras, caracteres, frases, verifique limites de SEO/redes e estime tempo de leitura/fala em tempo real. Tudo no navegador e 100% gratuito.";

export const metadata = toolMetadata({
  slug: "contador-palavras",
  title: "Contador de Palavras e Caracteres Online — Análise Completa de Texto",
  description: DESCRIPTION,
});

const FAQ = [
  {
    q: "O que essa ferramenta calcula?",
    a: "Ela calcula simultaneamente: palavras, caracteres (com e sem espaços), frases, parágrafos, linhas, além do tempo estimado de leitura e fala.",
  },
  {
    q: "Meu texto é enviado para algum servidor?",
    a: "Não. Todo o processamento acontece localmente no seu navegador. Nenhum texto é enviado, armazenado ou compartilhado — é totalmente privado.",
  },
  {
    q: "Quais limites de caracteres são exibidos?",
    a: "Mostramos os limites mais usados: título SEO (60), meta description (160), tweet/X (280), SMS (160) e bio do Instagram (150), com barra de progresso para cada um.",
  },
  {
    q: "Como o tempo de leitura é calculado?",
    a: "Dividimos o número de palavras pela velocidade de leitura (padrão de 200 ppm) para o tempo de leitura, e usamos ~130 ppm para o tempo de fala.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="contador-palavras"
      emoji="📝"
      title="Analisador e Contador de Texto"
      heroDescription={
        <>
          Conte <strong style={{ color: "var(--text)" }}>palavras, caracteres, frases</strong>, acompanhe os limites de SEO e estime o
          tempo de leitura. Tudo no navegador, 100% gratuito.
        </>
      }
      schemaName="Analisador e Contador de Texto"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Análise completa do seu texto",
        body: (
          <p>
            Cole ou digite seu texto na caixa acima. A contagem de palavras, caracteres (com e sem espaços),
            frases, parágrafos e o tempo estimado de leitura/fala aparecem instantaneamente. Acompanhe também os
            limites comuns para redes sociais e SEO. Ideal para redatores, criadores de conteúdo e estudantes.
          </p>
        ),
      }}
      faq={FAQ}
      related={["comparador-textos", "removedor-linhas", "text-cleaner"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <WordCounter />
    </ToolPage>
  );
}
