import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import WordCounter from "./WordCounter";

const DESCRIPTION =
  "Conte palavras, caracteres, frases, parágrafos e o tempo de leitura do seu texto em tempo real. 100% gratuito, funciona no navegador e nada é enviado para servidores.";

export const metadata = toolMetadata({
  slug: "contador-palavras",
  title: "Contador de Palavras Online — Grátis e Sem Upload",
  description: DESCRIPTION,
});

const FAQ = [
  {
    q: "Como o contador de palavras funciona?",
    a: "Ele separa o texto por espaços em branco e conta cada sequência como uma palavra. Caracteres, frases, parágrafos e tempo de leitura são calculados ao mesmo tempo, atualizando em tempo real conforme você digita.",
  },
  {
    q: "Meu texto é enviado para algum servidor?",
    a: "Não. Todo o processamento acontece localmente no seu navegador. Nenhum texto é enviado, armazenado ou compartilhado — é totalmente privado.",
  },
  {
    q: "Como o tempo de leitura é calculado?",
    a: "Dividimos o número de palavras pela velocidade de leitura escolhida (padrão de 200 palavras por minuto). Você pode ajustar a velocidade para estimativas de leitura mais lenta ou mais rápida.",
  },
  {
    q: "Existe limite de caracteres ou palavras?",
    a: "Não há limite prático. Como o cálculo é feito no seu dispositivo, você pode colar textos longos, artigos ou documentos inteiros.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="contador-palavras"
      emoji="📝"
      title="Contador de Palavras"
      heroDescription={
        <>
          Conte <strong style={{ color: "var(--text)" }}>palavras, caracteres, frases, parágrafos</strong> e o
          tempo de leitura do seu texto em tempo real. Tudo no navegador, sem upload e 100% gratuito.
        </>
      }
      schemaName="Contador de Palavras"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como contar palavras de um texto",
        body: (
          <p>
            Cole ou digite seu texto na caixa acima. A contagem de palavras, caracteres (com e sem espaços),
            frases, parágrafos e o tempo estimado de leitura aparecem instantaneamente. É ideal para redatores,
            estudantes e profissionais que precisam respeitar limites de palavras em redações, posts, meta
            descrições ou trabalhos acadêmicos.
          </p>
        ),
      }}
      faq={FAQ}
      related={["contador-caracteres", "tempo-leitura", "text-cleaner"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <WordCounter />
    </ToolPage>
  );
}
