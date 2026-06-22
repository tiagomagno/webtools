import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import RuleOfThree from "./RuleOfThree";

const DESCRIPTION = "Calcule a regra de três simples direta e inversa online. Informe A, B e C para encontrar X. Ideal para estudantes e profissionais. Grátis.";

export const metadata = toolMetadata({
  slug: "regra-de-tres",
  title: "Regra de Três Online — Simples Direta e Inversa",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é regra de três direta?", a: "Quando A e B são diretamente proporcionais: se A aumenta, B aumenta na mesma proporção. Exemplo: 3 peças custam R$30, 5 peças custam R$50." },
  { q: "O que é regra de três inversa?", a: "Quando A e B são inversamente proporcionais: se A aumenta, B diminui. Exemplo: 4 pessoas levam 6 dias para um trabalho; 8 pessoas levariam 3 dias." },
  { q: "Como preencher os campos?", a: "Informe A, B e C. A fórmula direta calcula X = (B × C) / A. A inversa calcula X = (A × C) / B." },
];

export default function Page() {
  return (
    <ToolPage
      slug="regra-de-tres"
      emoji="⚖️"
      title="Regra de Três"
      heroDescription={<>Calcule a <strong style={{ color: "var(--text)" }}>regra de três simples</strong> direta e inversa — encontre X instantaneamente.</>}
      schemaName="Calculadora de Regra de Três"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como funciona a regra de três", body: <p>Na regra de três direta, os valores são diretamente proporcionais (A/B = C/X). Na inversa, são inversamente proporcionais (A × X = B × C). Escolha o tipo, informe três valores e encontre o quarto automaticamente.</p> }}
      faq={FAQ}
      related={["calculadora-porcentagem", "calculadora-desconto", "calculadora-imc"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <RuleOfThree />
    </ToolPage>
  );
}
