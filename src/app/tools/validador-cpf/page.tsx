import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CpfValidator from "./CpfValidator";

const DESCRIPTION = "Valide CPF verificando os dígitos verificadores pelo algoritmo da Receita Federal. Aceita com ou sem pontuação. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "validador-cpf",
  title: "Validador de CPF Online — Verifique se o CPF é Válido",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que o validador verifica?", a: "Os dois dígitos verificadores (10° e 11° dígitos) pelo algoritmo módulo 11 da Receita Federal. Não consulta nenhuma base de dados — apenas valida a estrutura matemática." },
  { q: "CPF com todos os dígitos iguais é válido?", a: "Não. CPFs como 111.111.111-11 são matematicamente inválidos e recusados pelo sistema." },
  { q: "Aceita CPF sem pontuação?", a: "Sim. O validador aceita 11 dígitos sem formatação ou no formato 000.000.000-00." },
  { q: "Significa que o CPF existe?", a: "Não. Um CPF matematicamente válido pode não estar cadastrado na Receita Federal. A ferramenta verifica apenas a estrutura, não a existência." },
];

export default function Page() {
  return (
    <ToolPage
      slug="validador-cpf"
      emoji="✅"
      title="Validador de CPF"
      heroDescription={<>Verifique se um <strong style={{ color: "var(--text)" }}>CPF é matematicamente válido</strong> pelo algoritmo da Receita Federal — sem consultar bases de dados.</>}
      schemaName="Validador de CPF"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como funciona a validação de CPF", body: <p>O 10° e 11° dígitos de um CPF são calculados com base nos 9 primeiros dígitos usando multiplicações e módulo 11. Se os dígitos informados não baterem com o cálculo, o CPF é inválido.</p> }}
      faq={FAQ}
      related={["gerador-cpf", "validador-cnpj", "gerador-cnpj"]}
      ctaText="Precisa de mais ferramentas?"
    >
      <CpfValidator />
    </ToolPage>
  );
}
