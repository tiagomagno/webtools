import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import ExtratorDocumentos from "./ExtratorDocumentos";

const DESCRIPTION = "Extraia texto de PDF e DOCX por página e converta PDF, DOCX, XLS/XLSX e PPTX em Markdown, direto no navegador, sem enviar o arquivo.";

export const metadata = toolMetadata({
  slug: "extrator-documentos",
  title: "Extrator de Documentos — Texto de PDF/DOCX e Conversão para Markdown",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="extrator-documentos"
      title="Extrator de Documentos"
      heroDescription={<>Extraia <strong style={{ color: "var(--text)" }}>texto de PDF e DOCX</strong> por página ou converta PDF, DOCX, XLSX e PPTX em Markdown. Sem upload.</>}
      schemaName="Extrator de Documentos"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["ferramentas-pdf", "formatador-dados"]}
    >
      <ExtratorDocumentos />
    </ToolPage>
  );
}
