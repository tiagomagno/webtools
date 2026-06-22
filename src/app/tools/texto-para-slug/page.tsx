import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import SlugTool from "./SlugTool";

const DESCRIPTION =
  "Gere slugs amigáveis para URL a partir de qualquer texto: remove acentos, troca espaços por hífen e limpa caracteres especiais. Grátis e instantâneo.";

export const metadata = toolMetadata({
  slug: "texto-para-slug",
  title: "Gerador de Slug Online — Texto para URL Amigável Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é um slug?", a: "É a parte legível de uma URL que identifica uma página, como 'como-criar-um-blog'. Slugs bem formados melhoram a leitura e o SEO dos links." },
  { q: "Os acentos são removidos?", a: "Sim. Com a opção estrita, acentos são convertidos (á → a, ç → c) e apenas letras de a–z e números são mantidos, separados por hífen." },
  { q: "Posso usar sublinhado em vez de hífen?", a: "Sim. Escolha entre hífen, sublinhado ou ponto como separador. Para URLs, o hífen é o mais recomendado pelos buscadores." },
  { q: "Espaços e símbolos são tratados?", a: "Sim. Espaços viram o separador escolhido e símbolos como !, ?, : e / são removidos, sem gerar separadores duplicados." },
  { q: "O texto é enviado para servidores?", a: "Não. O slug é gerado inteiramente no seu navegador, em tempo real." },
];

export default function Page() {
  return (
    <ToolPage
      slug="texto-para-slug"
      emoji="🔗"
      title="Texto para Slug"
      heroDescription={
        <>
          Gere <strong style={{ color: "var(--text)" }}>slugs amigáveis para URL</strong> a partir de qualquer texto:
          remove acentos, troca espaços por hífen e limpa caracteres especiais.
        </>
      }
      schemaName="Gerador de Slug"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como gerar um slug para URL",
        body: <p>Digite ou cole o título no campo de texto. O slug é gerado em tempo real, com opções de separador, caixa e modo estrito (remoção de acentos). Copie e use diretamente em URLs, identificadores e nomes de arquivo.</p>,
      }}
      faq={FAQ}
      related={["markdown-para-html", "contador-caracteres", "serp-preview"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <SlugTool />
    </ToolPage>
  );
}
