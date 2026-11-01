import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import Imoveis from "./Imoveis";

const DESCRIPTION = "Simule financiamentos SAC e PRICE com tabela de amortização e calcule o reajuste de aluguel por IGP-M, IPCA, INPC ou percentual.";

export const metadata = toolMetadata({
  slug: "imoveis",
  title: "Financiamento Imobiliário e Reajuste de Aluguel — Simuladores",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="imoveis"
      title="Imóveis"
      heroDescription={<>Simule <strong style={{ color: "var(--text)" }}>financiamento SAC e PRICE</strong> com tabela de amortização e o reajuste do aluguel por IGP-M, IPCA ou INPC.</>}
      schemaName="Imóveis"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["investimentos", "trabalho-impostos"]}
    >
      <Imoveis />
    </ToolPage>
  );
}
