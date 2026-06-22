import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import InvestmentCalculator from "./InvestmentCalculator";

const DESCRIPTION = "Compare rendimentos de CDB, LCI/LCA e Poupança com desconto de IR. Informe o CDI anual e os percentuais para ver qual investimento rende mais. Grátis.";

export const metadata = toolMetadata({
  slug: "calculadora-investimento",
  title: "Comparador de Investimentos — CDB, LCI e Poupança Online",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é CDB?", a: "Certificado de Depósito Bancário. Rende um percentual do CDI e tem incidência de Imposto de Renda regressivo (22,5% a 15% conforme o prazo)." },
  { q: "O que é LCI/LCA?", a: "Letras de Crédito Imobiliário e do Agronegócio. Isentas de IR para pessoas físicas, por isso rendem menos bruto mas podem superar o CDB líquido." },
  { q: "Qual a regra da Poupança atual?", a: "Com Selic acima de 8,5% a.a., a poupança rende 0,5% ao mês + TR ≈ 70% do CDI. A ferramenta usa 70% do CDI informado como estimativa." },
  { q: "O CDI é igual à Selic?", a: "Quase. O CDI historicamente fica 0,1 pp abaixo da Selic. Insira o valor atual do CDI para resultado preciso." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-investimento"
      emoji="📊"
      title="Comparador de Investimentos"
      heroDescription={<>Compare <strong style={{ color: "var(--text)" }}>CDB, LCI/LCA e Poupança</strong> com IR incluído — descubra qual rende mais no seu prazo.</>}
      schemaName="Comparador de Investimentos em Renda Fixa"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como comparar investimentos de renda fixa", body: <p>Informe o valor, o prazo e o CDI atual. Configure o percentual de cada produto (ex: CDB a 110% do CDI, LCI a 95% do CDI). O comparador calcula o rendimento líquido de IR e aponta a melhor opção para o seu perfil.</p> }}
      faq={FAQ}
      related={["juros-compostos", "simulador-financiamento", "calculadora-salario"]}
      ctaText="Precisa de mais ferramentas financeiras?"
    >
      <InvestmentCalculator />
    </ToolPage>
  );
}
