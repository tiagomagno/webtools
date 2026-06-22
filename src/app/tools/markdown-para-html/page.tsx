import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import MarkdownTool from "./MarkdownTool";

const DESCRIPTION =
  "Converta Markdown em HTML com preview em tempo real e código pronto para copiar. Suporta títulos, listas, links, código e citações. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "markdown-para-html",
  title: "Markdown para HTML Online — Converter e Visualizar Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é Markdown?", a: "É uma linguagem de marcação leve que usa símbolos simples (#, *, -, etc.) para formatar texto. É muito usada em READMEs, documentação, blogs e mensagens." },
  { q: "Quais elementos são suportados?", a: "Títulos, negrito, itálico, código inline e em bloco, listas ordenadas e não ordenadas, links, imagens, citações e regras horizontais." },
  { q: "Posso ver o resultado antes de copiar?", a: "Sim. A aba Preview mostra o HTML renderizado em tempo real; a aba HTML mostra o código gerado, pronto para copiar." },
  { q: "O HTML gerado é seguro?", a: "O texto é escapado para evitar injeção de tags arbitrárias. Ainda assim, revise o conteúdo antes de publicar em produção." },
  { q: "Meus dados são enviados para servidores?", a: "Não. A conversão acontece inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="markdown-para-html"
      emoji="📝"
      title="Markdown para HTML"
      heroDescription={
        <>
          Converta <strong style={{ color: "var(--text)" }}>Markdown em HTML</strong> com preview em tempo real e
          código pronto para copiar. Suporta títulos, listas, links, código e citações.
        </>
      }
      schemaName="Conversor Markdown para HTML"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter Markdown em HTML",
        body: <p>Escreva ou cole o Markdown no campo da esquerda. À direita, alterne entre o preview renderizado e o código HTML gerado. Copie o HTML para usar em sites, e-mails ou CMSs. Todo o processamento é local.</p>,
      }}
      faq={FAQ}
      related={["json-formatter", "texto-para-slug", "csv-para-json"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <MarkdownTool />
    </ToolPage>
  );
}
