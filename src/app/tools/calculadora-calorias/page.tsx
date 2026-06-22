import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CalorieCalculator from "./CalorieCalculator";

const DESCRIPTION = "Calcule sua Taxa Metabólica Basal (TMB) e gasto calórico diário (TDEE) pela fórmula Mifflin-St Jeor. Defina objetivo e veja a meta de calorias. Grátis.";

export const metadata = toolMetadata({
  slug: "calculadora-calorias",
  title: "Calculadora de Calorias Online — TMB e TDEE com Meta Diária",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é TMB?", a: "Taxa Metabólica Basal — o número de calorias que o corpo gasta em repouso absoluto para manter as funções vitais (respiração, circulação, etc.)." },
  { q: "O que é TDEE?", a: "Total Daily Energy Expenditure — o gasto calórico total levando em conta o nível de atividade física. É o ponto de equilíbrio para manter o peso." },
  { q: "Qual fórmula é usada?", a: "Mifflin-St Jeor (1990), considerada a mais precisa para adultos: 10 × peso + 6,25 × altura − 5 × idade + (5 para homens, −161 para mulheres)." },
  { q: "Quanto é 1 kg de gordura em calorias?", a: "Aproximadamente 7.700 kcal. Para perder 0,5 kg por semana, é preciso um déficit de ~550 kcal/dia." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-calorias"
      emoji="🔥"
      title="Calculadora de Calorias"
      heroDescription={<>Calcule sua <strong style={{ color: "var(--text)" }}>TMB e TDEE</strong> pela fórmula Mifflin-St Jeor e descubra sua meta calórica diária.</>}
      schemaName="Calculadora de Calorias"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como usar a calculadora", body: <p>Informe sexo, idade, peso e altura. Selecione o nível de atividade física e o objetivo (emagrecer, manter ou ganhar peso). A calculadora exibe a TMB, o TDEE e a meta diária de calorias ajustada para seu objetivo.</p> }}
      faq={FAQ}
      related={["calculadora-imc", "calculadora-macros", "calculadora-porcentagem"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <CalorieCalculator />
    </ToolPage>
  );
}
