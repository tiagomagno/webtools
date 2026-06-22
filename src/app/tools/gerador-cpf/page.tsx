import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CpfGenerator from "./CpfGenerator";

const DESCRIPTION = "Gere CPFs válidos (com dígitos verificadores corretos) para uso em testes de software. Até 100 por vez, com ou sem formatação. Grátis.";

export const metadata = toolMetadata({
  slug: "gerador-cpf",
  title: "Gerador de CPF Online — CPF Válido para Testes",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Os CPFs gerados existem de verdade?", a: "Não. São números fictícios com dígitos verificadores matematicamente válidos. Não correspondem a nenhuma pessoa real na Receita Federal." },
  { q: "Por que gerar CPF para testes?", a: "Ao testar sistemas que validam CPF (formulários, APIs, bancos de dados), é necessário um número com dígito verificador correto — mas que não seja de uma pessoa real." },
  { q: "Como funciona o dígito verificador?", a: "O CPF tem dois dígitos verificadores calculados por operações de módulo 11 sobre os 9 primeiros dígitos, garantindo que o número siga a regra da Receita Federal." },
  { q: "Posso usar esses CPFs para fraudes?", a: "Não. Esses CPFs são matematicamente válidos, mas não estão cadastrados. Qualquer tentativa de uso fraudulento é crime e será detectada." },
];

export default function Page() {
  return (
    <ToolPage
      slug="gerador-cpf"
      emoji="🪪"
      title="Gerador de CPF"
      heroDescription={<>Gere <strong style={{ color: "var(--text)" }}>CPFs válidos para testes</strong> — dígitos verificadores corretos, nunca vinculados a pessoas reais.</>}
      schemaName="Gerador de CPF"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Para que serve gerar CPF", body: <p>Desenvolvedores precisam de CPFs com estrutura válida para preencher formulários e testar validações em sistemas. Use esses CPFs apenas em ambientes de desenvolvimento e QA — nunca em produção ou para fins fraudulentos.</p> }}
      faq={FAQ}
      related={["validador-cpf", "gerador-cnpj", "validador-cnpj"]}
      ctaText="Precisa de mais ferramentas?"
    >
      <CpfGenerator />
    </ToolPage>
  );
}
