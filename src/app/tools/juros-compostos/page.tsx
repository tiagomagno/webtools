import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CompoundCalculator from "./CompoundCalculator";

const DESCRIPTION =
  "Simule juros compostos com valor inicial, aportes mensais, taxa ao mês ou ano e prazo. Veja o valor final, total investido, juros e a evolução mês a mês. Grátis.";

export const metadata = toolMetadata({
  slug: "juros-compostos",
  title: "Calculadora de Juros Compostos Online — Simular Investimento",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que são juros compostos?", a: "São juros que incidem sobre o capital inicial e também sobre os juros já acumulados. Por isso o crescimento é exponencial ao longo do tempo — o famoso 'juros sobre juros'." },
  { q: "Posso incluir aportes mensais?", a: "Sim. Informe um valor de aporte mensal para simular investimentos recorrentes, somados ao montante a cada mês." },
  { q: "A taxa é ao mês ou ao ano?", a: "Você escolhe. Se informar a taxa anual, ela é convertida para a taxa mensal equivalente automaticamente." },
  { q: "O que mostra a tabela?", a: "A evolução do total investido e do montante acumulado ao longo do período, em pontos distribuídos do prazo informado." },
  { q: "Os cálculos são feitos no servidor?", a: "Não. Tudo é calculado no seu navegador, em tempo real." },
];

export default function Page() {
  return (
    <ToolPage
      slug="juros-compostos"
      emoji="📈"
      title="Calculadora de Juros Compostos"
      heroDescription={
        <>
          Simule <strong style={{ color: "var(--text)" }}>juros compostos</strong> com valor inicial, aportes mensais,
          taxa ao mês ou ano e prazo. Veja o valor final, os juros e a evolução mês a mês.
        </>
      }
      schemaName="Calculadora de Juros Compostos"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como simular juros compostos",
        body: <p>Preencha o valor inicial, o aporte mensal, a taxa de juros (ao mês ou ao ano) e o prazo em meses. A calculadora mostra o montante final, quanto você investiu, quanto rendeu em juros e a curva de crescimento. Útil para planejar investimentos e metas financeiras.</p>,
      }}
      faq={FAQ}
      related={["calculadora-porcentagem", "calculadora-desconto", "calculadora-idade"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <CompoundCalculator />
    </ToolPage>
  );
}
