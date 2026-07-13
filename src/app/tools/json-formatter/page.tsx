import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import JsonTools from "./JsonTools";

const DESCRIPTION =
  "Ferramenta JSON completa: formate, idente, minifique, valide e compare arquivos JSON online. Grátis, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "json-formatter",
  title: "Ferramenta JSON — Formatter, Validator e Diff",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="json-formatter"
      emoji="🧩"
      title="Ferramenta JSON"
      heroDescription={
        <>
          A <strong style={{ color: "var(--text)" }}>ferramenta definitiva para JSON</strong>: formate, idente, valide erros ou faça comparação (Diff) de chaves — tudo num só lugar.
        </>
      }
      schemaName="Ferramenta JSON"
      schemaDescription={DESCRIPTION}
      faq={[]}
    >
      <JsonTools />
    </ToolPage>
  );
}
