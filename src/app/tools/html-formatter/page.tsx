import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import HtmlFormatter from "./HtmlFormatter";

const DESCRIPTION = "Formate e indente HTML minificado ou bagunçado com indentação de 2 espaços. Suporte a tags vazias (br, img, input). Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "html-formatter",
  title: "HTML Formatter Online — Formate e Indente HTML Instantaneamente",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Tags como <br> e <img> são tratadas corretamente?", a: "Sim. O formatador conhece as tags void do HTML5 (br, img, input, hr, meta, link, etc.) e não gera indentação incorreta para elas." },
  { q: "Funciona com HTML completo?", a: "Funciona com fragmentos e documentos completos. Para HTMLs muito grandes e complexos, prefira uma IDE como VS Code." },
  { q: "O HTML é enviado ao servidor?", a: "Não. A formatação ocorre inteiramente no navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="html-formatter"
      emoji="🖋️"
      title="HTML Formatter"
      heroDescription={<>Formate e indente <strong style={{ color: "var(--text)" }}>HTML minificado ou bagunçado</strong> instantaneamente.</>}
      schemaName="HTML Formatter"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Quando usar o HTML Formatter", body: <p>Útil para legibilidade de HTML gerado por ferramentas, minificadores ou CMS. Basta colar o código comprimido e copiar a versão identada de volta para o seu editor.</p> }}
      faq={FAQ}
      related={["css-minifier", "json-formatter", "regex-tester"]}
      ctaText="Precisa de mais ferramentas de Dev?"
    >
      <HtmlFormatter />
    </ToolPage>
  );
}
