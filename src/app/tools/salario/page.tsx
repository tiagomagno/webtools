import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import SalarioHub from "./SalarioHub";

const DESCRIPTION = "Calcule salário líquido (INSS, IRPF, dependentes) e verbas rescisórias (saldo, aviso, férias, 13°, FGTS e multa de 40%) em um só lugar. Grátis.";

export const metadata = toolMetadata({
  slug: "salario",
  title: "Calculadora de Salário e Rescisão — Líquido, FGTS e Verbas",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Qual tabela de INSS é usada?", a: "A tabela progressiva de 2026: 7,5% até R$1.518, 9% até R$2.793,88, 12% até R$4.190,83 e 14% até R$8.157,41." },
  { q: "O vale-transporte e alimentação são descontados?", a: "Use o campo 'Outras deduções' para informar esses valores. Eles reduzem a base de cálculo do IRPF." },
  { q: "Quais tipos de rescisão são suportados?", a: "Demissão sem justa causa (direito a tudo), pedido de demissão (sem aviso indenizado e sem multa FGTS) e demissão por justa causa (sem aviso, férias vencidas, 13° e FGTS)." },
  { q: "O cálculo de rescisão inclui descontos de INSS/IRPF?", a: "Não. O calculador mostra as verbas brutas. INSS e IRPF sobre a rescisão variam conforme cada verba — consulte o RH ou um contador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="salario"
      emoji="💳"
      title="Salário"
      heroDescription={<>Calcule o <strong style={{ color: "var(--text)" }}>salário líquido</strong> ou as <strong style={{ color: "var(--text)" }}>verbas rescisórias</strong> em um só lugar.</>}
      schemaName="Calculadora de Salário e Rescisão"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como funciona o cálculo", body: <p>No cálculo de salário, o INSS é calculado de forma progressiva sobre o bruto, e o IRPF é apurado pela tabela progressiva após deduzir INSS, dependentes e outras deduções. Na rescisão, somam-se saldo de salário, aviso prévio, férias proporcionais + 1/3, 13° proporcional, FGTS e multa de 40%, conforme o tipo de desligamento.</p> }}
      faq={FAQ}
      related={["simulador-financiamento", "calculadora-investimento", "calculadora-ir-acoes"]}
      ctaText="Precisa de mais ferramentas financeiras?"
    >
      <SalarioHub />
    </ToolPage>
  );
}
