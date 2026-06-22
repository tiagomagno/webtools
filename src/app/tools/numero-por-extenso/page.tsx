import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import NumberToWords from "./NumberToWords";

const DESCRIPTION = "Converta qualquer número para extenso em português: de 1 a 999 bilhões. Ideal para contratos, documentos e cheques. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "numero-por-extenso",
  title: "Número por Extenso em Português — Até 999 Bilhões",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Até qual número funciona?", a: "Até 999 bilhões (999.999.999.999). Para valores maiores, a ferramenta exibe uma mensagem de intervalo excedido." },
  { q: "Funciona com números negativos?", a: "Sim. Números negativos são precedidos por 'menos'." },
  { q: "Pode usar para cheques?", a: "A saída serve de base para cheques, mas confira o formato exigido pelo seu banco (uso de vírgula para centavos, capitalização, etc.)." },
  { q: "Os dados são enviados ao servidor?", a: "Não. O cálculo é feito 100% no navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="numero-por-extenso"
      emoji="🔢"
      title="Número por Extenso"
      heroDescription={<>Converta números para <strong style={{ color: "var(--text)" }}>extenso em português</strong> instantaneamente — até 999 bilhões.</>}
      schemaName="Número por Extenso"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Para que serve número por extenso?", body: <p>Obrigatório em contratos, documentos jurídicos e cheques, onde o valor em algarismos deve ser acompanhado de sua forma por extenso para evitar fraudes e ambiguidades.</p> }}
      faq={FAQ}
      related={["calculadora-porcentagem", "calculadora-desconto", "calculadora-salario"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <NumberToWords />
    </ToolPage>
  );
}
