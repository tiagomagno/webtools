import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import PercentCalculator from "./PercentCalculator";

const DESCRIPTION =
  "Calcule porcentagens de três formas: X% de um valor, quanto um número representa de outro e a variação percentual entre dois valores. Grátis e instantâneo.";

export const metadata = toolMetadata({
  slug: "calculadora-porcentagem",
  title: "Calculadora de Porcentagem Online — Calcular % Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como calcular X% de um valor?", a: "Use o modo 'X% de Y': informe a porcentagem e o valor. Por exemplo, 20% de 150 = 30." },
  { q: "Como saber quanto um número representa de outro?", a: "Use o modo 'X é quanto % de Y'. Por exemplo, 30 é 20% de 150." },
  { q: "Como calcular variação percentual?", a: "Use o modo 'Variação de X para Y'. Ele mostra o aumento ou redução percentual entre o valor inicial e o final." },
  { q: "Aceita números decimais?", a: "Sim. Você pode usar vírgula ou ponto como separador decimal." },
  { q: "Os cálculos são feitos no servidor?", a: "Não. Tudo é calculado no seu navegador, em tempo real." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-porcentagem"
      emoji="％"
      title="Calculadora de Porcentagem"
      heroDescription={
        <>
          Calcule <strong style={{ color: "var(--text)" }}>porcentagens</strong> de três formas: X% de um valor, quanto
          um número representa de outro e a variação percentual entre dois valores.
        </>
      }
      schemaName="Calculadora de Porcentagem"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como usar a calculadora de porcentagem",
        body: <p>Escolha o tipo de cálculo, preencha os dois valores e veja o resultado na hora. É útil para descontos, juros, gorjetas, metas e qualquer situação que envolva proporção.</p>,
      }}
      faq={FAQ}
      related={["calculadora-desconto", "juros-compostos", "calculadora-imc"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <PercentCalculator />
    </ToolPage>
  );
}
