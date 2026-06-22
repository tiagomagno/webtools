import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import FuelCalculator from "./FuelCalculator";

const DESCRIPTION = "Calcule o consumo de combustível em uma viagem: litros necessários, custo total e custo por km. Informe distância, consumo e preço do litro. Grátis.";

export const metadata = toolMetadata({
  slug: "calculadora-combustivel",
  title: "Calculadora de Combustível — Litros e Custo de Viagem",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é consumo em km/l?", a: "É quantos quilômetros o veículo percorre com um litro de combustível. Carro econômico faz ~14 km/l; SUV faz ~8–10 km/l." },
  { q: "Funciona para álcool e gasolina?", a: "Sim. Informe o consumo e o preço do combustível que você está usando (álcool ou gasolina) — o cálculo é o mesmo." },
  { q: "Como saber o consumo do meu carro?", a: "Abasteceu cheio, zerou o odômetro, rodou e abasteceu novamente cheio. Divida os km rodados pelos litros abastecidos." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-combustivel"
      emoji="⛽"
      title="Calculadora de Combustível"
      heroDescription={<>Calcule <strong style={{ color: "var(--text)" }}>litros e custo de uma viagem</strong> informando distância, consumo e preço do litro.</>}
      schemaName="Calculadora de Combustível"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como calcular o combustível de uma viagem", body: <p>Divida a distância pelo consumo do veículo para obter os litros necessários. Multiplique pelo preço do litro para ter o custo total. A calculadora faz tudo isso automaticamente.</p> }}
      faq={FAQ}
      related={["calculadora-porcentagem", "calculadora-desconto", "calculadora-imc"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <FuelCalculator />
    </ToolPage>
  );
}
