import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import DiscountCalculator from "./DiscountCalculator";

const DESCRIPTION =
  "Calcule o preço final com desconto e quanto você economiza, a partir do preço original e do percentual de desconto. Grátis e instantâneo.";

export const metadata = toolMetadata({
  slug: "calculadora-desconto",
  title: "Calculadora de Desconto Online — Preço com Desconto Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como calcular o preço com desconto?", a: "Informe o preço original e o percentual de desconto. O preço final é o original menos o valor do desconto (preço × % ÷ 100)." },
  { q: "Quanto vou economizar?", a: "A ferramenta mostra exatamente o valor economizado em reais, além do preço final já com o desconto aplicado." },
  { q: "Posso usar centavos?", a: "Sim. Use vírgula ou ponto para os centavos, por exemplo 199,90." },
  { q: "Serve para qualquer moeda?", a: "O cálculo percentual é o mesmo para qualquer moeda; aqui exibimos em reais (R$)." },
  { q: "Os dados são enviados para servidores?", a: "Não. Tudo é calculado no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-desconto"
      emoji="🏷️"
      title="Calculadora de Desconto"
      heroDescription={
        <>
          Descubra o <strong style={{ color: "var(--text)" }}>preço final com desconto</strong> e quanto você economiza,
          a partir do preço original e do percentual.
        </>
      }
      schemaName="Calculadora de Desconto"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como calcular um desconto",
        body: <p>Digite o preço original e o percentual de desconto. Veja na hora o preço final e o valor economizado. Ideal para conferir promoções, liquidações e ofertas de Black Friday.</p>,
      }}
      faq={FAQ}
      related={["calculadora-porcentagem", "juros-compostos", "calculadora-imc"]}
      ctaText="Precisa de mais calculadoras?"
    >
      <DiscountCalculator />
    </ToolPage>
  );
}
