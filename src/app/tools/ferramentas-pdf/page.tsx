import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import FerramentasPdf from "./FerramentasPdf";

const DESCRIPTION = "Una vários PDFs, divida por intervalos, comprima em 3 níveis, junte imagens JPG em PDF e converta cada página em JPG ou PNG. Sem upload.";

export const metadata = toolMetadata({
  slug: "ferramentas-pdf",
  title: "Ferramentas de PDF Online — Unir, Dividir, Comprimir e Converter",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="ferramentas-pdf"
      title="Ferramentas de PDF"
      heroDescription={<><strong style={{ color: "var(--text)" }}>Una, divida e comprima</strong> PDFs e converta entre PDF e imagens, tudo no navegador.</>}
      schemaName="Ferramentas de PDF"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["extrator-documentos", "editor-imagem"]}
    >
      <FerramentasPdf />
    </ToolPage>
  );
}
