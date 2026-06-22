import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import ReadingTime from "./ReadingTime";

const DESCRIPTION =
  "Calcule o tempo de leitura e o tempo de fala de qualquer texto. Ideal para artigos, posts e roteiros. Ajuste a velocidade em palavras por minuto. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "tempo-leitura",
  title: "Calculadora de Tempo de Leitura — Estime Minutos de Leitura",
  description: DESCRIPTION,
});

const FAQ = [
  {
    q: "Como o tempo de leitura é calculado?",
    a: "Dividimos o número de palavras pela velocidade de leitura escolhida (padrão de 200 palavras por minuto, a média de um leitor adulto). Você pode ajustar a velocidade conforme o público.",
  },
  {
    q: "Qual a diferença entre tempo de leitura e tempo de fala?",
    a: "A leitura silenciosa costuma ser mais rápida (~200 ppm) do que a fala em voz alta (~130 ppm). Por isso mostramos as duas estimativas — útil para roteiros de vídeo e podcasts.",
  },
  {
    q: "Que velocidade devo usar?",
    a: "Para conteúdo geral, 200 ppm é uma boa média. Textos técnicos podem usar 150 ppm; leitores rápidos chegam a 300 ppm ou mais.",
  },
  {
    q: "Serve para o 'tempo de leitura' de blogs?",
    a: "Sim. É exatamente o cálculo usado por plataformas como Medium para exibir o aviso de 'X min de leitura' no topo dos artigos.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="tempo-leitura"
      emoji="⏱️"
      title="Tempo de Leitura"
      heroDescription={
        <>
          Estime o <strong style={{ color: "var(--text)" }}>tempo de leitura e de fala</strong> de um texto.
          Perfeito para artigos, posts de blog e roteiros de vídeo ou podcast.
        </>
      }
      schemaName="Calculadora de Tempo de Leitura"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como estimar o tempo de leitura de um texto",
        body: (
          <p>
            Cole seu conteúdo e veja em segundos quanto tempo levará para ler e para falar em voz alta. A
            estimativa de leitura usa a velocidade que você escolher; a de fala usa ~130 palavras por minuto.
            É o mesmo indicador de &quot;X min de leitura&quot; que blogs exibem para dar ao leitor uma noção do tamanho
            do artigo.
          </p>
        ),
      }}
      faq={FAQ}
      related={["contador-palavras", "contador-caracteres", "text-cleaner"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <ReadingTime />
    </ToolPage>
  );
}
