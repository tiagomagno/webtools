import ToolPage from "../../components/ToolPage";
import Base64Tool from "../../components/Base64Tool";
import { toolMetadata } from "../../lib/seo";

const DESCRIPTION =
  "Codifique texto em Base64 online com suporte completo a UTF-8 (acentos e emojis). Resultado em tempo real, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "base64-encode",
  title: "Base64 Encode Online — Codificar Texto em Base64 (UTF-8)",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é codificação Base64?", a: "Base64 representa dados binários ou texto usando 64 caracteres ASCII. É muito usada para embutir dados em URLs, e-mails, JSON e arquivos de configuração." },
  { q: "Suporta acentos e emojis?", a: "Sim. A codificação trata o texto como UTF-8, então acentos (ção, ã) e emojis são codificados corretamente." },
  { q: "Base64 é criptografia?", a: "Não. É apenas uma codificação reversível — qualquer pessoa pode decodificar. Não use para proteger senhas ou dados sensíveis." },
  { q: "Meus dados são enviados a servidores?", a: "Não. A codificação é 100% local no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="base64-encode"
      emoji="🔢"
      title="Base64 Encode"
      heroDescription={
        <>
          Codifique <strong style={{ color: "var(--text)" }}>texto em Base64</strong> com suporte completo a
          UTF-8 (acentos e emojis), em tempo real.
        </>
      }
      schemaName="Base64 Encode"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como codificar em Base64",
        body: <p>Digite ou cole o texto e veja o Base64 instantaneamente. Ideal para embutir dados em data URIs, tokens, headers e arquivos de configuração.</p>,
      }}
      faq={FAQ}
      related={["base64-decode", "jwt-decoder", "hash-generator"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <Base64Tool mode="encode" />
    </ToolPage>
  );
}
