import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CnpjValidator from "./CnpjValidator";

const DESCRIPTION = "Valide CNPJ verificando os dígitos verificadores pelo algoritmo da Receita Federal. Aceita com ou sem pontuação. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "validador-cnpj",
  title: "Validador de CNPJ Online — Verifique se o CNPJ é Válido",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que o validador verifica?", a: "Os dois dígitos verificadores do CNPJ pelo algoritmo módulo 11 da Receita Federal. Não consulta o Cadastro Nacional de Pessoas Jurídicas." },
  { q: "Aceita CNPJ sem formatação?", a: "Sim. O validador aceita 14 dígitos sem pontuação ou no formato 00.000.000/0000-00." },
  { q: "CNPJ válido significa empresa ativa?", a: "Não. A ferramenta verifica apenas a estrutura matemática. Para checar se a empresa existe e está ativa, consulte o site da Receita Federal." },
];

export default function Page() {
  return (
    <ToolPage
      slug="validador-cnpj"
      emoji="✅"
      title="Validador de CNPJ"
      heroDescription={<>Verifique se um <strong style={{ color: "var(--text)" }}>CNPJ é matematicamente válido</strong> pelo algoritmo da Receita Federal.</>}
      schemaName="Validador de CNPJ"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como funciona a validação de CNPJ", body: <p>Os dois últimos dígitos de um CNPJ são verificadores calculados a partir dos 12 primeiros usando pesos e módulo 11, conforme o padrão da Receita Federal. A ferramenta verifica essa matemática instantaneamente.</p> }}
      faq={FAQ}
      related={["gerador-cnpj", "validador-cpf", "gerador-cpf"]}
      ctaText="Precisa de mais ferramentas?"
    >
      <CnpjValidator />
    </ToolPage>
  );
}
