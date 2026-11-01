import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import Codificadores from "./Codificadores";

const DESCRIPTION = "Codifique e decodifique Base64 (UTF-8), URLs (com análise de parâmetros) e leia o header e o payload de tokens JWT. Tudo no navegador.";

export const metadata = toolMetadata({
  slug: "codificadores",
  title: "Base64, URL e JWT Online — Codificar e Decodificar",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="codificadores"
      title="Codificadores"
      heroDescription={<>Codifique e decodifique <strong style={{ color: "var(--text)" }}>Base64</strong>, URLs e tokens <strong style={{ color: "var(--text)" }}>JWT</strong>, em tempo real.</>}
      schemaName="Codificadores"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["hash-uuid", "formatador-dados"]}
    >
      <Codificadores />
    </ToolPage>
  );
}
