import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import AgeCalculator from "./AgeCalculator";

const DESCRIPTION =
  "Calcule a idade exata em anos, meses e dias a partir da data de nascimento, com totais em semanas, dias e horas e contagem para o próximo aniversário. Grátis.";

export const metadata = toolMetadata({
  slug: "calculadora-idade",
  title: "Calculadora de Idade Online — Idade Exata em Anos e Dias",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como a idade é calculada?", a: "A partir da data de nascimento até hoje (ou uma data escolhida), considerando anos, meses e dias reais, inclusive a quantidade de dias de cada mês." },
  { q: "Posso calcular a idade em uma data específica?", a: "Sim. Use o campo 'calcular até' para descobrir a idade em uma data passada ou futura." },
  { q: "Mostra a contagem para o aniversário?", a: "Sim. Exibimos quantos dias faltam para o próximo aniversário." },
  { q: "Os dados são enviados para servidores?", a: "Não. Todo o cálculo é feito no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-idade"
      emoji="🎂"
      title="Calculadora de Idade"
      heroDescription={
        <>
          Descubra a <strong style={{ color: "var(--text)" }}>idade exata</strong> em anos, meses e dias, com totais em
          semanas, dias e horas e a contagem para o próximo aniversário.
        </>
      }
      schemaName="Calculadora de Idade"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como calcular a idade",
        body: <p>Informe a data de nascimento. A idade exata aparece na hora, junto com os totais equivalentes e os dias restantes para o próximo aniversário. Use o segundo campo para calcular a idade em qualquer data.</p>,
      }}
      faq={FAQ}
      related={["calculadora-datas", "unix-timestamp", "calculadora-porcentagem"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <AgeCalculator />
    </ToolPage>
  );
}
