import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import EmailValidator from "./EmailValidator";

const DESCRIPTION = "Valide endereços de e-mail com checklist detalhado: @, domínio, TLD, espaços, caracteres válidos. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "validador-email",
  title: "Validador de E-mail Online — Verifique se o E-mail é Válido",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O validador verifica se o e-mail existe?", a: "Não. A ferramenta verifica apenas a estrutura (sintaxe) do endereço. Para confirmar se o e-mail existe, seria necessário enviar uma mensagem de teste." },
  { q: "Quais regras são verificadas?", a: "Presença de @, parte local não vazia, domínio com ponto, TLD com pelo menos 2 caracteres, ausência de espaços, pontos consecutivos e caracteres inválidos." },
  { q: "E-mails com subdomínio são aceitos?", a: "Sim. Formatos como nome@mail.empresa.com.br são aceitos." },
];

export default function Page() {
  return (
    <ToolPage
      slug="validador-email"
      emoji="📧"
      title="Validador de E-mail"
      heroDescription={<>Valide endereços de e-mail com <strong style={{ color: "var(--text)" }}>checklist detalhado</strong> de sintaxe — instantâneo e sem envio de dados.</>}
      schemaName="Validador de E-mail"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como funciona a validação de e-mail", body: <p>A ferramenta analisa a estrutura do endereço em tempo real: verifica a presença do @, valida a parte local e o domínio, checa o TLD e identifica caracteres inválidos ou espaços. Não faz consulta de MX ou envio de e-mail.</p> }}
      faq={FAQ}
      related={["validador-cpf", "validador-cnpj", "formatador-telefone"]}
      ctaText="Precisa de mais ferramentas?"
    >
      <EmailValidator />
    </ToolPage>
  );
}
