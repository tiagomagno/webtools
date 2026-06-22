import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import DateCalculator from "./DateCalculator";

const DESCRIPTION =
  "Calcule a diferença entre duas datas em anos, meses, dias e semanas, ou some e subtraia dias de uma data. Grátis e instantâneo.";

export const metadata = toolMetadata({
  slug: "calculadora-datas",
  title: "Calculadora de Datas Online — Diferença e Soma de Dias",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como calcular a diferença entre duas datas?", a: "No modo 'Diferença entre datas', informe a data inicial e a final. O resultado mostra anos, meses e dias, além do total em dias e semanas." },
  { q: "Posso somar dias a uma data?", a: "Sim. No modo 'Somar / subtrair dias', escolha a data base, some ou subtraia, e veja a data resultante com o dia da semana." },
  { q: "A ordem das datas importa?", a: "Não para a diferença: o cálculo usa o valor absoluto, então tanto faz qual data é maior." },
  { q: "Considera anos bissextos?", a: "Sim. Os cálculos usam o calendário real, incluindo anos bissextos e a quantidade de dias de cada mês." },
  { q: "Os cálculos são feitos no servidor?", a: "Não. Tudo é processado no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-datas"
      emoji="📅"
      title="Calculadora de Datas"
      heroDescription={
        <>
          Calcule a <strong style={{ color: "var(--text)" }}>diferença entre duas datas</strong> em anos, meses, dias e
          semanas, ou some e subtraia dias de uma data.
        </>
      }
      schemaName="Calculadora de Datas"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como calcular com datas",
        body: <p>Escolha o modo: diferença entre duas datas ou soma/subtração de dias. Os resultados consideram o calendário real, com anos bissextos. Útil para prazos, contratos, gestações, contagens regressivas e planejamento.</p>,
      }}
      faq={FAQ}
      related={["calculadora-idade", "unix-timestamp", "calculadora-porcentagem"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <DateCalculator />
    </ToolPage>
  );
}
