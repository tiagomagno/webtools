import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import TrabalhoImpostos from "./TrabalhoImpostos";

const DESCRIPTION = "Calcule salário líquido (INSS e IRPF), verbas rescisórias, contribuição INSS de autônomo, DAS MEI e estime quando pode se aposentar.";

export const metadata = toolMetadata({
  slug: "trabalho-impostos",
  title: "Salário Líquido, Rescisão, INSS Autônomo, MEI e Aposentadoria",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="trabalho-impostos"
      title="Trabalho e Impostos"
      heroDescription={<>Calcule <strong style={{ color: "var(--text)" }}>salário líquido e rescisão</strong>, INSS de autônomo, o DAS do MEI e estime a aposentadoria.</>}
      schemaName="Trabalho e Impostos"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["imoveis", "investimentos"]}
    >
      <TrabalhoImpostos />
    </ToolPage>
  );
}
