import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import MacroCalculator from "./MacroCalculator";

const DESCRIPTION = "Calcule a distribuição de macronutrientes (proteína, carboidrato e gordura) em gramas por dia com base nas suas calorias e objetivo. Grátis.";

export const metadata = toolMetadata({
  slug: "calculadora-macros",
  title: "Calculadora de Macros Online — Proteína, Carboidrato e Gordura",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que são macronutrientes?", a: "Proteínas, carboidratos e gorduras — os três grupos que fornecem energia. Cada grama de proteína e carboidrato tem 4 kcal; cada grama de gordura tem 9 kcal." },
  { q: "Qual distribuição usar para perda de peso?", a: "Para definição, o preset 'Definição' usa 40% proteína, 30% carbo e 30% gordura. Alta proteína preserva massa muscular no déficit calórico." },
  { q: "O que é dieta cetogênica?", a: "Alta em gorduras (~70%), moderada em proteínas e muito baixa em carboidratos (~5%), forçando o metabolismo a usar corpos cetônicos como energia." },
  { q: "Como uso a calculadora junto com a de calorias?", a: "Calcule sua meta calórica na Calculadora de Calorias e depois use essa meta aqui para distribuir os macros." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-macros"
      emoji="🥗"
      title="Calculadora de Macros"
      heroDescription={<>Distribua <strong style={{ color: "var(--text)" }}>proteína, carboidrato e gordura</strong> em gramas por dia conforme sua meta calórica e objetivo.</>}
      schemaName="Calculadora de Macronutrientes"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como funciona a calculadora de macros", body: <p>Informe a meta de calorias diárias (obtida na Calculadora de Calorias) e o percentual de cada macronutriente. A ferramenta converte os percentuais em gramas, usando 4 kcal/g para proteínas e carboidratos, e 9 kcal/g para gorduras.</p> }}
      faq={FAQ}
      related={["calculadora-calorias", "calculadora-imc", "calculadora-porcentagem"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <MacroCalculator />
    </ToolPage>
  );
}
