import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CpfCnpjTool from "./CpfCnpjTool";

const DESCRIPTION = "Gere CPFs e CNPJs válidos para testes ou valide os dígitos verificadores pelo algoritmo da Receita Federal — tudo em uma única ferramenta, grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "cpf-cnpj",
  title: "Gerador e Validador de CPF e CNPJ Online",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Os CPFs e CNPJs gerados existem de verdade?", a: "Não. São números fictícios com dígitos verificadores matematicamente válidos — não correspondem a nenhuma pessoa ou empresa real na Receita Federal." },
  { q: "Para que serve gerar CPF ou CNPJ para testes?", a: "Ao testar sistemas que validam esses documentos (formulários, APIs, ERPs), é necessário um número com dígito verificador correto, mas que não seja de uma pessoa ou empresa real." },
  { q: "O que a validação verifica?", a: "Os dígitos verificadores pelo algoritmo módulo 11 da Receita Federal. Não consulta nenhuma base de dados — apenas a estrutura matemática do número." },
  { q: "CPF ou CNPJ válido significa que existe de verdade?", a: "Não. Um número matematicamente válido pode não estar cadastrado. Para confirmar existência, consulte o site da Receita Federal." },
  { q: "Posso usar esses documentos para fraudes?", a: "Não. São matematicamente válidos, mas não estão cadastrados. Qualquer tentativa de uso fraudulento é crime e será detectada." },
];

export default function Page() {
  return (
    <ToolPage
      slug="cpf-cnpj"
      emoji="🪪"
      title="CPF e CNPJ"
      heroDescription={<>Gere <strong style={{ color: "var(--text)" }}>CPFs e CNPJs válidos</strong> para testes ou valide os dígitos verificadores — escolha o documento e a ação abaixo.</>}
      schemaName="Gerador e Validador de CPF e CNPJ"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como funciona",
        body: (
          <p>
            Escolha entre <strong>CPF</strong> e <strong>CNPJ</strong>, depois entre <strong>Gerar</strong> (cria números fictícios
            com dígitos verificadores corretos) ou <strong>Validar</strong> (confere se os dígitos de um número informado batem com
            o algoritmo módulo 11 da Receita Federal). Use os números gerados apenas em ambientes de teste.
          </p>
        ),
      }}
      faq={FAQ}
      related={["formatador-telefone", "gerador-senha", "validador-luhn"]}
      ctaText="Precisa de mais ferramentas?"
    >
      <CpfCnpjTool />
    </ToolPage>
  );
}
