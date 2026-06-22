import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import UnitConverter from "./UnitConverter";

const DESCRIPTION = "Converta unidades de comprimento, peso, volume, área, velocidade e temperatura. Mais de 30 unidades disponíveis. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "conversor-unidades",
  title: "Conversor de Unidades Online — Comprimento, Peso, Volume e mais",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quais categorias estão disponíveis?", a: "Comprimento (mm, cm, m, km, in, ft, mi), Peso (mg, g, kg, t, lb, oz), Volume (ml, l, m³, gal), Área (mm², cm², m², ha, ac), Velocidade (m/s, km/h, mph, nó) e Temperatura (°C, °F, K)." },
  { q: "Funciona com vírgula decimal?", a: "Sim. Aceita tanto ponto quanto vírgula como separador decimal." },
  { q: "Os cálculos de temperatura são corretos?", a: "Sim. Temperatura não usa uma simples proporção — a ferramenta aplica as fórmulas corretas: °C × 9/5 + 32 para Fahrenheit, °C + 273,15 para Kelvin." },
];

export default function Page() {
  return (
    <ToolPage
      slug="conversor-unidades"
      emoji="📏"
      title="Conversor de Unidades"
      heroDescription={<>Converta <strong style={{ color: "var(--text)" }}>comprimento, peso, volume, área, velocidade e temperatura</strong> — mais de 30 unidades disponíveis.</>}
      schemaName="Conversor de Unidades"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Unidades disponíveis", body: <p>O conversor inclui unidades do Sistema Internacional (SI) e unidades imperiais americanas, cobrindo as conversões mais comuns em ciência, culinária, engenharia e cotidiano.</p> }}
      faq={FAQ}
      related={["conversor-temperatura", "calculadora-imc", "calculadora-porcentagem"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <UnitConverter />
    </ToolPage>
  );
}
