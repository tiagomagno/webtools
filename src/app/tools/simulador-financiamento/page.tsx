import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import LoanSimulator from "./LoanSimulator";

const DESCRIPTION = "Simule financiamentos nos sistemas SAC (parcelas decrescentes) e PRICE (parcelas fixas). Veja tabela completa de amortização com juros e saldo devedor. Grátis.";

export const metadata = toolMetadata({
  slug: "simulador-financiamento",
  title: "Simulador de Financiamento Online — SAC e PRICE com Tabela de Amortização",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Qual a diferença entre SAC e PRICE?", a: "No SAC (Sistema de Amortização Constante), a amortização é fixa e os juros caem a cada mês, gerando parcelas decrescentes. No PRICE, a parcela é fixa — no início você paga mais juros do que amortização." },
  { q: "Qual sistema é mais vantajoso?", a: "No longo prazo, o SAC paga menos juros totais. Mas as primeiras parcelas são mais altas. O PRICE é mais comum em financiamentos imobiliários por ter parcelas previsíveis." },
  { q: "A taxa é mensal ou anual?", a: "Anual. A ferramenta converte automaticamente para taxa mensal equivalente." },
  { q: "Funciona para financiamento de imóvel e veículo?", a: "Sim. Informe o valor financiado, a taxa de juros e o prazo. O tipo de bem não altera o cálculo matemático." },
];

export default function Page() {
  return (
    <ToolPage
      slug="simulador-financiamento"
      emoji="🏠"
      title="Simulador de Financiamento"
      heroDescription={<>Simule financiamentos <strong style={{ color: "var(--text)" }}>SAC e PRICE</strong> com tabela completa de amortização, juros e saldo devedor.</>}
      schemaName="Simulador de Financiamento"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como usar o simulador", body: <p>Informe o valor financiado, a taxa de juros anual e o prazo em meses. Escolha entre SAC (parcelas decrescentes) ou PRICE (parcelas fixas). O simulador exibe o resumo e a tabela completa de amortização mês a mês.</p> }}
      faq={FAQ}
      related={["calculadora-investimento", "calculadora-salario", "juros-compostos"]}
      ctaText="Precisa de mais ferramentas financeiras?"
    >
      <LoanSimulator />
    </ToolPage>
  );
}
