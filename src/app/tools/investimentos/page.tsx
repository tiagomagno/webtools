import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import Investimentos from "./Investimentos";

const DESCRIPTION = "Compare CDB, LCI/LCA e poupança com IR incluído e calcule o imposto de renda sobre ganho de capital em ações (15% ou 20%).";

export const metadata = toolMetadata({
  slug: "investimentos",
  title: "Comparador de Investimentos e IR sobre Ações",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="investimentos"
      title="Investimentos"
      heroDescription={<>Compare <strong style={{ color: "var(--text)" }}>CDB, LCI/LCA e poupança</strong> com IR incluído e calcule o imposto sobre ganho de capital em ações.</>}
      schemaName="Investimentos"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["trabalho-impostos", "calculadoras"]}
    >
      <Investimentos />
    </ToolPage>
  );
}
