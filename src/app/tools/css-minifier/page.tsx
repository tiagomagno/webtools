import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CssMinifier from "./CssMinifier";

const DESCRIPTION = "Minifique CSS removendo espaços, comentários e quebras de linha desnecessárias. Veja a redução de bytes em tempo real. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "css-minifier",
  title: "Minificador de CSS Online — Reduza o Tamanho do CSS Instantaneamente",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que o minificador remove?", a: "Comentários (/* */), espaços em branco redundantes, quebras de linha e espaços ao redor de seletores e propriedades CSS." },
  { q: "Funciona com CSS de frameworks?", a: "Sim, desde que o CSS seja texto simples. Pré-processadores como SASS/LESS devem ser compilados primeiro." },
  { q: "O CSS é enviado ao servidor?", a: "Não. A minificação ocorre inteiramente no navegador." },
  { q: "Isso afeta a aparência do site?", a: "Não. O CSS minificado é funcionalmente idêntico — apenas mais compacto para economizar banda." },
];

export default function Page() {
  return (
    <ToolPage
      slug="css-minifier"
      emoji="🗜️"
      title="Minificador de CSS"
      heroDescription={<>Minifique CSS removendo <strong style={{ color: "var(--text)" }}>comentários, espaços e quebras de linha</strong> para reduzir o tamanho do arquivo.</>}
      schemaName="Minificador de CSS"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Por que minificar o CSS?", body: <p>CSS minificado carrega mais rápido porque tem menos bytes para transferir. Em sites de produção, a minificação pode reduzir o CSS em 20–40%, melhorando o tempo de carregamento e o score do Core Web Vitals.</p> }}
      faq={FAQ}
      related={["html-formatter", "json-formatter", "regex-tester"]}
      ctaText="Precisa de mais ferramentas de Dev?"
    >
      <CssMinifier />
    </ToolPage>
  );
}
