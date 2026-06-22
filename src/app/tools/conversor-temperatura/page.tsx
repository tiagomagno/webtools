import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import TempConverter from "./TempConverter";

const DESCRIPTION =
  "Converta temperatura entre Celsius, Fahrenheit e Kelvin instantaneamente. Veja os três valores ao mesmo tempo. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "conversor-temperatura",
  title: "Conversor de Temperatura Online — Celsius, Fahrenheit e Kelvin",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como converter Celsius para Fahrenheit?", a: "A fórmula é °F = °C × 9/5 + 32. Por exemplo, 25 °C equivalem a 77 °F. A ferramenta faz isso automaticamente." },
  { q: "E para Kelvin?", a: "K = °C + 273,15. O Kelvin é a unidade do Sistema Internacional, com o zero absoluto em 0 K (−273,15 °C)." },
  { q: "Posso converter a partir de qualquer unidade?", a: "Sim. Escolha a unidade de origem e veja os valores nas três escalas simultaneamente." },
  { q: "Aceita números negativos e decimais?", a: "Sim. Use vírgula ou ponto para decimais; valores negativos são suportados." },
  { q: "Os cálculos são feitos no servidor?", a: "Não. Tudo é calculado no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="conversor-temperatura"
      emoji="🌡️"
      title="Conversor de Temperatura"
      heroDescription={
        <>
          Converta temperatura entre <strong style={{ color: "var(--text)" }}>Celsius, Fahrenheit e Kelvin</strong>{" "}
          instantaneamente, vendo as três escalas ao mesmo tempo.
        </>
      }
      schemaName="Conversor de Temperatura"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter temperaturas",
        body: <p>Digite o valor, escolha a unidade de origem (°C, °F ou K) e veja a conversão para as outras escalas em tempo real. Útil para receitas, viagens, clima e ciências.</p>,
      }}
      faq={FAQ}
      related={["css-units", "calculadora-porcentagem", "calculadora-imc"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <TempConverter />
    </ToolPage>
  );
}
