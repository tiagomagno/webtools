import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import SalaryCalculator from "./SalaryCalculator";

const DESCRIPTION = "Calcule seu salário líquido descontando INSS e IRPF 2026. Informe dependentes e outras deduções. Tabela progressiva atualizada. Grátis.";

export const metadata = toolMetadata({
  slug: "calculadora-salario",
  title: "Calculadora de Salário Líquido 2026 — INSS e IRPF",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Qual tabela de INSS é usada?", a: "A tabela progressiva de 2026: 7,5% até R$1.518, 9% até R$2.793,88, 12% até R$4.190,83 e 14% até R$8.157,41." },
  { q: "O vale-transporte e alimentação são descontados?", a: "Use o campo 'Outras deduções' para informar esses valores. Eles reduzem a base de cálculo do IRPF." },
  { q: "O 13° salário é calculado aqui?", a: "Não. A calculadora calcula o líquido mensal. O 13° tem cálculo próprio (isento de INSS na 1ª parcela e base diferente de IRPF)." },
  { q: "O resultado é exato?", a: "Aproximado. A alíquota efetiva de INSS é progressiva e pode variar com acordos coletivos. Consulte um contador para cálculo definitivo." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-salario"
      emoji="💳"
      title="Calculadora de Salário Líquido"
      heroDescription={<>Calcule o <strong style={{ color: "var(--text)" }}>salário líquido 2026</strong> com INSS progressivo, IRPF e deduções de dependentes.</>}
      schemaName="Calculadora de Salário Líquido"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como funciona o cálculo", body: <p>O INSS é calculado de forma progressiva sobre o salário bruto. Em seguida, deduzem-se INSS, dependentes e outras deduções para obter a base de cálculo do IRPF. O IRPF é calculado pela tabela progressiva e deduzido do bruto junto com o INSS.</p> }}
      faq={FAQ}
      related={["calculadora-rescisao", "simulador-financiamento", "calculadora-investimento"]}
      ctaText="Precisa de mais ferramentas financeiras?"
    >
      <SalaryCalculator />
    </ToolPage>
  );
}
