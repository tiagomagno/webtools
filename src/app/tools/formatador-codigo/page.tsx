import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CodeFormatterTools from "./CodeFormatterTools";

const DESCRIPTION =
  "Formate, indente e minifique códigos SQL, HTML, CSS e XML online. Ferramenta completa para desenvolvedores web no navegador.";

export const metadata = toolMetadata({
  slug: "formatador-codigo",
  title: "Formatador de Código — SQL, HTML, CSS e XML Grátis",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="formatador-codigo"
      emoji="🗄️"
      title="Formatador de Código"
      heroDescription={
        <>
          <strong style={{ color: "var(--text)" }}>Formate e minifique</strong> seus códigos SQL, HTML, CSS e XML
          facilmente, com indentação automática e suporte offline.
        </>
      }
      schemaName="Formatador de Código"
      schemaDescription={DESCRIPTION}
      faq={[]}
    >
      <CodeFormatterTools />
    </ToolPage>
  );
}
