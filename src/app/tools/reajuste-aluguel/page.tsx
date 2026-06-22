import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import RentAdjustment from "./RentAdjustment";

const DESCRIPTION = "Simule o reajuste de aluguel pelo IGP-M, IPCA, INPC ou percentual personalizado. Veja o novo valor, o aumento mensal e o acumulado no período. Grátis.";

export const metadata = toolMetadata({
  slug: "reajuste-aluguel",
  title: "Simulador de Reajuste de Aluguel — IGP-M, IPCA e INPC Online",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Qual índice é mais usado para aluguel?", a: "Historicamente o IGP-M (Índice Geral de Preços do Mercado), mas desde 2020 muitos contratos migraram para o IPCA, que costuma ser mais estável." },
  { q: "O reajuste é obrigatório?", a: "Depende do contrato. A cláusula de reajuste deve estar prevista. O percentual acordado em contrato prevalece sobre os índices referenciais." },
  { q: "O cálculo é exato?", a: "O simulador usa um percentual fixo informado — na realidade, o índice acumulado de 12 meses deve ser verificado na fonte oficial (FGV, IBGE)." },
];

export default function Page() {
  return (
    <ToolPage
      slug="reajuste-aluguel"
      emoji="🏘️"
      title="Reajuste de Aluguel"
      heroDescription={<>Simule o <strong style={{ color: "var(--text)" }}>reajuste de aluguel</strong> por IGP-M, IPCA, INPC ou percentual personalizado.</>}
      schemaName="Simulador de Reajuste de Aluguel"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como funciona o reajuste de aluguel", body: <p>A maioria dos contratos prevê reajuste anual baseado em um índice de inflação. Insira o valor atual, o índice aplicado e o prazo para ver o novo valor e o impacto acumulado no orçamento.</p> }}
      faq={FAQ}
      related={["calculadora-investimento", "simulador-financiamento", "calculadora-porcentagem"]}
      ctaText="Precisa de mais ferramentas financeiras?"
    >
      <RentAdjustment />
    </ToolPage>
  );
}
