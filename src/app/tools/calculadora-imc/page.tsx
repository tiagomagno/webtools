import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import BmiCalculator from "./BmiCalculator";

const DESCRIPTION =
  "Calcule seu IMC (Índice de Massa Corporal) informando peso e altura, com a classificação da OMS e a faixa de peso ideal. Grátis e instantâneo.";

export const metadata = toolMetadata({
  slug: "calculadora-imc",
  title: "Calculadora de IMC Online — Índice de Massa Corporal Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como o IMC é calculado?", a: "O IMC é o peso (kg) dividido pela altura (m) ao quadrado: IMC = peso / (altura × altura). O resultado é comparado às faixas da OMS." },
  { q: "Quais são as faixas de classificação?", a: "Abaixo de 18,5: abaixo do peso; 18,5–24,9: normal; 25–29,9: sobrepeso; 30–34,9: obesidade I; 35–39,9: obesidade II; 40 ou mais: obesidade III." },
  { q: "O IMC serve para todo mundo?", a: "É uma referência geral para adultos, mas não distingue músculo de gordura nem se aplica bem a atletas, gestantes, crianças e idosos. Consulte um profissional de saúde." },
  { q: "Qual o peso ideal para minha altura?", a: "Calculamos a faixa de peso correspondente ao IMC entre 18,5 e 24,9 para a altura informada." },
  { q: "Meus dados são enviados para servidores?", a: "Não. O cálculo é feito inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-imc"
      emoji="⚖️"
      title="Calculadora de IMC"
      heroDescription={
        <>
          Calcule seu <strong style={{ color: "var(--text)" }}>IMC</strong> informando peso e altura, com a
          classificação da OMS e a faixa de peso ideal para sua altura.
        </>
      }
      schemaName="Calculadora de IMC"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como interpretar o IMC",
        body: <p>Informe peso e altura para ver o IMC e sua classificação. O IMC é um indicador de triagem útil, mas não avalia composição corporal — use-o como referência inicial e busque orientação profissional para uma avaliação completa.</p>,
      }}
      faq={FAQ}
      related={["calculadora-porcentagem", "calculadora-idade", "conversor-temperatura"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <BmiCalculator />
    </ToolPage>
  );
}
