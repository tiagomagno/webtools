import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CnpjGenerator from "./CnpjGenerator";

const DESCRIPTION = "Gere CNPJs válidos (com dígitos verificadores corretos) para uso em testes de software. Até 100 por vez, com ou sem formatação. Grátis.";

export const metadata = toolMetadata({
  slug: "gerador-cnpj",
  title: "Gerador de CNPJ Online — CNPJ Válido para Testes",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Os CNPJs gerados são de empresas reais?", a: "Não. São números fictícios com dígitos verificadores corretos. Não correspondem a nenhuma empresa na Receita Federal." },
  { q: "Para que serve gerar CNPJ para testes?", a: "Ao desenvolver sistemas que validam CNPJ (ERP, formulários, APIs de nota fiscal), é necessário um número estruturalmente válido sem usar o de uma empresa real." },
  { q: "Como funciona o CNPJ?", a: "O CNPJ tem 14 dígitos: 8 para a empresa, 4 para o estabelecimento e 2 dígitos verificadores calculados por módulo 11." },
];

export default function Page() {
  return (
    <ToolPage
      slug="gerador-cnpj"
      emoji="🏢"
      title="Gerador de CNPJ"
      heroDescription={<>Gere <strong style={{ color: "var(--text)" }}>CNPJs válidos para testes</strong> — dígitos verificadores corretos, sem empresa real associada.</>}
      schemaName="Gerador de CNPJ"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Para que serve gerar CNPJ", body: <p>Desenvolvedores precisam de CNPJs com estrutura válida para testar formulários e sistemas de nota fiscal, ERP e APIs da Receita Federal. Use apenas em ambientes de teste e nunca para fins fraudulentos.</p> }}
      faq={FAQ}
      related={["validador-cnpj", "gerador-cpf", "validador-cpf"]}
      ctaText="Precisa de mais ferramentas?"
    >
      <CnpjGenerator />
    </ToolPage>
  );
}
