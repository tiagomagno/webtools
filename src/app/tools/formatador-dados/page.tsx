import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import FormatadorDados from "./FormatadorDados";

const DESCRIPTION = "Formate, valide e compare JSON, formate SQL, HTML, CSS e XML, converta CSV em JSON (e o contrário) e Markdown em HTML. Tudo no navegador, sem enviar seus dados.";

export const metadata = toolMetadata({
  slug: "formatador-dados",
  title: "Formatador JSON, SQL, HTML, CSS, XML, CSV e Markdown Online",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="formatador-dados"
      title="Formatador de Dados e Código"
      heroDescription={<>Formate, valide e compare <strong style={{ color: "var(--text)" }}>JSON</strong>; formate SQL, HTML, CSS e XML; converta CSV e JSON; transforme Markdown em HTML.</>}
      schemaName="Formatador de Dados e Código"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["codificadores", "regex-cron"]}
    >
      <FormatadorDados />
    </ToolPage>
  );
}
