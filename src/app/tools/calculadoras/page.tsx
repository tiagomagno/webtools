import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CalculadorasHub from "./CalculadorasHub";

const DESCRIPTION = "20 calculadoras em um só lugar: idade, IMC, porcentagem, desconto, juros, datas, horas, temperatura, unidades, combustível, gorjeta, regra de três, calorias, macros, energia, m², tela e tempo. Grátis, sem cadastro.";

export const metadata = toolMetadata({
  slug: "calculadoras",
  title: "Calculadoras Online — Idade, IMC, Juros, Datas e Mais",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quais calculadoras estão disponíveis?", a: "Idade, IMC, porcentagem, desconto, juros compostos e simples, datas, horas, tempo, temperatura, unidades, custo por m², tela/monitor, combustível, gasolina vs álcool, energia elétrica, gorjeta, regra de três, calorias e macros." },
  { q: "Os cálculos são salvos ou enviados a algum servidor?", a: "Não. Tudo é processado localmente no seu navegador." },
  { q: "Para onde foram as páginas individuais de cada calculadora?", a: "Foram unificadas aqui para facilitar a navegação. Links antigos (como /tools/calculadora-idade) continuam funcionando e redirecionam automaticamente para a aba certa." },
];

export default function Page() {
  return (
    <ToolPage
      slug="calculadoras"
      emoji="🧮"
      title="Calculadoras"
      heroDescription={<>Mais de <strong style={{ color: "var(--text)" }}>20 calculadoras</strong> em um só lugar — escolha o tipo abaixo e calcule na hora.</>}
      schemaName="Calculadoras Online"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como usar",
        body: <p>Selecione o tipo de cálculo nas abas acima — idade, IMC, juros, datas, conversões e várias outras opções. Cada calculadora mantém sua própria lógica e resultado, tudo na mesma página.</p>,
      }}
      faq={FAQ}
      related={["simulador-financiamento", "calculadora-investimento", "conversor-cores"]}
      ctaText="Precisa de mais ferramentas?"
    >
      <CalculadorasHub />
    </ToolPage>
  );
}
