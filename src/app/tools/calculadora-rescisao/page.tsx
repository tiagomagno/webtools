import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import RescisaoCalculator from "./RescisaoCalculator";

const DESCRIPTION = "Calcule as verbas rescisórias: saldo de salário, aviso prévio, férias proporcionais, 13° proporcional, FGTS e multa de 40%. Grátis.";

export const metadata = toolMetadata({
  slug: "calculadora-rescisao",
  title: "Calculadora de Rescisão Trabalhista — Verbas e FGTS Online",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quais tipos de rescisão são suportados?", a: "Demissão sem justa causa (direito a tudo), pedido de demissão (sem aviso indenizado e sem multa FGTS) e demissão por justa causa (sem aviso, férias vencidas, 13° e FGTS)." },
  { q: "O que é a multa do FGTS?", a: "Na demissão sem justa causa, o empregador deve pagar ao empregado uma multa de 40% sobre o saldo do FGTS depositado durante o período do contrato." },
  { q: "O cálculo inclui descontos?", a: "Não. O calculador mostra as verbas brutas. INSS e IRPF sobre a rescisão variam conforme cada verba — consulte o RH ou um contador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-rescisao"
      emoji="📋"
      title="Calculadora de Rescisão"
      heroDescription={<>Calcule <strong style={{ color: "var(--text)" }}>verbas rescisórias</strong>: saldo, férias, 13°, FGTS e multa de 40% por tipo de demissão.</>}
      schemaName="Calculadora de Rescisão Trabalhista"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Verbas rescisórias no Brasil", body: <p>Na demissão sem justa causa, o trabalhador tem direito a: saldo de salário, aviso prévio indenizado, férias proporcionais + 1/3, 13° proporcional, liberação do FGTS e multa de 40%. O pedido de demissão exclui aviso indenizado e multa FGTS.</p> }}
      faq={FAQ}
      related={["calculadora-salario", "simulador-financiamento", "calculadora-porcentagem"]}
      ctaText="Precisa de mais ferramentas financeiras?"
    >
      <RescisaoCalculator />
    </ToolPage>
  );
}
