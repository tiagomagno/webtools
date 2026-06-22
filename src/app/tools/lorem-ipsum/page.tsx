import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import LoremGenerator from "./LoremGenerator";

const DESCRIPTION =
  "Gere texto Lorem Ipsum em parágrafos, frases ou palavras para usar como texto de preenchimento em layouts e protótipos. Grátis e instantâneo.";

export const metadata = toolMetadata({
  slug: "lorem-ipsum",
  title: "Gerador de Lorem Ipsum Online — Texto de Preenchimento Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é Lorem Ipsum?", a: "É um texto de preenchimento padrão, sem significado, usado por designers e desenvolvedores para simular conteúdo em layouts sem distrair com palavras reais." },
  { q: "Posso escolher a quantidade?", a: "Sim. Defina o número e a unidade: parágrafos, frases ou palavras." },
  { q: "Dá para começar com o texto clássico?", a: "Sim. Mantenha a opção marcada para iniciar com 'Lorem ipsum dolor sit amet...', o trecho tradicional." },
  { q: "Para que serve?", a: "Para preencher mockups, wireframes, templates de e-mail, protótipos e testes de tipografia antes do conteúdo final." },
  { q: "O texto é gerado no servidor?", a: "Não. É gerado no seu navegador, instantaneamente." },
];

export default function Page() {
  return (
    <ToolPage
      slug="lorem-ipsum"
      emoji="📄"
      title="Gerador de Lorem Ipsum"
      heroDescription={
        <>
          Gere <strong style={{ color: "var(--text)" }}>texto Lorem Ipsum</strong> em parágrafos, frases ou palavras
          para usar como preenchimento em layouts e protótipos.
        </>
      }
      schemaName="Gerador de Lorem Ipsum"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como usar o Lorem Ipsum",
        body: <p>Escolha a quantidade e a unidade (parágrafos, frases ou palavras) e clique em Gerar. Copie o texto e cole no seu design ou código para simular o conteúdo enquanto o texto definitivo não chega.</p>,
      }}
      faq={FAQ}
      related={["contador-palavras", "markdown-para-html", "texto-para-slug"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <LoremGenerator />
    </ToolPage>
  );
}
