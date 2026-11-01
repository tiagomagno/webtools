import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import DocumentosBr from "./DocumentosBr";

const DESCRIPTION = "Gere ou valide CPF e CNPJ, gere números de cartão válidos pelo algoritmo Luhn, valide cartões e formate telefones brasileiros com link do WhatsApp.";

export const metadata = toolMetadata({
  slug: "documentos-br",
  title: "CPF, CNPJ, Cartão (Luhn) e Telefone — Gerar, Validar e Formatar",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="documentos-br"
      title="Documentos BR"
      heroDescription={<>Gere e valide <strong style={{ color: "var(--text)" }}>CPF e CNPJ</strong>, números de cartão (Luhn) e formate telefones com o link do WhatsApp.</>}
      schemaName="Documentos BR"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["geradores", "hash-uuid"]}
    >
      <DocumentosBr />
    </ToolPage>
  );
}
