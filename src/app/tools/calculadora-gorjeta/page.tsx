import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import TipCalculator from "./TipCalculator";

const DESCRIPTION = "Calcule gorjeta (0–20%), total da conta e divisão por pessoa. Selecione o percentual e informe o número de pessoas. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "calculadora-gorjeta",
  title: "Calculadora de Gorjeta — Divida a Conta por Pessoa Online",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Qual a gorjeta padrão no Brasil?", a: "No Brasil, a gorjeta de 10% é comum em restaurantes, mas não é obrigatória. O cliente pode escolher não pagar." },
  { q: "O serviço de 10% já está incluído?", a: "Muitos restaurantes incluem o serviço automaticamente na conta. Se já estiver incluso, use gorjeta 0% para ver apenas a divisão por pessoa." },
  { q: "Posso usar percentual personalizado?", a: "Sim. Use o campo numérico à direita dos botões de atalho para inserir qualquer percentual." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-gorjeta"
      emoji="🍽️"
      title="Calculadora de Gorjeta"
      heroDescription={<>Calcule <strong style={{ color: "var(--text)" }}>gorjeta e divisão da conta</strong> por pessoa com percentual customizável.</>}
      schemaName="Calculadora de Gorjeta"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como usar a calculadora", body: <p>Informe o valor total da conta, escolha o percentual de gorjeta e o número de pessoas. A calculadora mostra instantaneamente o valor da gorjeta, o total e o quanto cada um deve pagar.</p> }}
      faq={FAQ}
      related={["calculadora-desconto", "calculadora-porcentagem", "calculadora-salario"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <TipCalculator />
    </ToolPage>
  );
}
