import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import UrlTools from "./UrlTools";

const DESCRIPTION =
  "Codifique e decodifique URLs, parâmetros e faça o parse (decomposição) de URLs em componentes como host, query e hash. Grátis e online.";

export const metadata = toolMetadata({
  slug: "codificador-url",
  title: "Ferramenta de URL — Encode, Decode e Parser de URL Grátis",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="codificador-url"
      emoji="🔗"
      title="Ferramenta de URL"
      heroDescription={
        <>
          <strong style={{ color: "var(--text)" }}>Codifique, decodifique e faça o parse</strong> de URLs
          e seus parâmetros em um só lugar.
        </>
      }
      schemaName="Ferramenta de URL"
      schemaDescription={DESCRIPTION}
      faq={[]}
    >
      <UrlTools />
    </ToolPage>
  );
}
