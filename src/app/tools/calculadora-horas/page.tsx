import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import HoursCalculator from "./HoursCalculator";

const DESCRIPTION = "Some ou subtraia horas e minutos no formato HH:MM. Ideal para controle de ponto, horas extras e duração de projetos. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "calculadora-horas",
  title: "Calculadora de Horas Online — Some e Subtraia Horas e Minutos",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Qual o formato de entrada?", a: "Use HH:MM (horas:minutos). Exemplos: 1:30, 8:00, 0:45." },
  { q: "Posso somar mais de 4 durações?", a: "A calculadora tem 4 campos. Para somar mais, some os primeiros 4 e use o resultado como nova entrada." },
  { q: "O resultado pode ser negativo?", a: "Sim, no modo de subtração. Se a diferença for negativa, o resultado é exibido com sinal de menos." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-horas"
      emoji="⏱️"
      title="Calculadora de Horas"
      heroDescription={<>Some e subtraia <strong style={{ color: "var(--text)" }}>horas e minutos</strong> no formato HH:MM — ideal para ponto e duração de projetos.</>}
      schemaName="Calculadora de Horas"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Para que serve a calculadora de horas", body: <p>Útil para controle de ponto, cálculo de horas extras, estimativa de projetos e qualquer situação que exija somar ou subtrair durações de tempo sem converter para decimais.</p> }}
      faq={FAQ}
      related={["calculadora-datas", "unix-timestamp", "calculadora-desconto"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <HoursCalculator />
    </ToolPage>
  );
}
