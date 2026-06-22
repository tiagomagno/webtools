import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CharCounter from "./CharCounter";

const DESCRIPTION =
  "Conte caracteres com e sem espaços em tempo real e verifique limites de título SEO, meta description, tweet, SMS e bio. Grátis, no navegador, sem upload.";

export const metadata = toolMetadata({
  slug: "contador-caracteres",
  title: "Contador de Caracteres Online — Com Limites de SEO e Redes",
  description: DESCRIPTION,
});

const FAQ = [
  {
    q: "Espaços contam como caracteres?",
    a: "Sim. Mostramos os dois valores: total de caracteres (incluindo espaços e quebras de linha) e o total sem espaços, para você escolher o que precisa.",
  },
  {
    q: "Quais limites de caracteres são exibidos?",
    a: "Mostramos os limites mais usados: título SEO (60), meta description (160), tweet/X (280), SMS (160) e bio do Instagram (150), com barra de progresso para cada um.",
  },
  {
    q: "Os emojis contam como um caractere?",
    a: "A contagem usa o tamanho da string em JavaScript, então alguns emojis compostos podem contar como mais de uma unidade — o mesmo critério usado por vários campos de formulário.",
  },
  {
    q: "Meu texto fica salvo em algum lugar?",
    a: "Não. Todo o cálculo é feito localmente no seu navegador; nada é enviado para servidores.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="contador-caracteres"
      emoji="🔤"
      title="Contador de Caracteres"
      heroDescription={
        <>
          Conte <strong style={{ color: "var(--text)" }}>caracteres com e sem espaços</strong> e acompanhe os
          limites de título SEO, meta description, tweet, SMS e bio — tudo em tempo real.
        </>
      }
      schemaName="Contador de Caracteres"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Para que serve contar caracteres",
        body: (
          <p>
            Saber o número exato de caracteres é essencial para respeitar limites de campos: títulos e meta
            descriptions no Google, posts em redes sociais, mensagens SMS e biografias. A ferramenta mostra o
            quanto você já usou de cada limite com uma barra de progresso, alertando em vermelho quando passa do
            máximo recomendado.
          </p>
        ),
      }}
      faq={FAQ}
      related={["contador-palavras", "tempo-leitura", "serp-preview"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <CharCounter />
    </ToolPage>
  );
}
