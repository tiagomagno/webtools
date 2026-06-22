import ToolPage from "../../components/ToolPage";
import Base64Tool from "../../components/Base64Tool";
import { toolMetadata } from "../../lib/seo";

const DESCRIPTION =
  "Decodifique Base64 de volta para texto legível com suporte a UTF-8. Detecta entradas inválidas. Resultado em tempo real, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "base64-decode",
  title: "Base64 Decode Online — Decodificar Base64 para Texto",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como decodificar Base64?", a: "Cole a string Base64 e o texto decodificado aparece automaticamente. A decodificação trata o conteúdo como UTF-8 para exibir acentos e emojis corretamente." },
  { q: "E se o Base64 for inválido?", a: "Avisamos que o conteúdo é inválido. Verifique se você não colou caracteres extras, espaços ou se a string está incompleta." },
  { q: "Decodificar revela uma senha 'protegida'?", a: "Base64 não é criptografia. Se algo foi apenas codificado em Base64, ele pode ser totalmente recuperado — por isso não deve ser usado como proteção." },
  { q: "É seguro colar dados sensíveis?", a: "Sim. Tudo é processado localmente no navegador, sem envio para servidores." },
];

export default function Page() {
  return (
    <ToolPage
      slug="base64-decode"
      emoji="🔣"
      title="Base64 Decode"
      heroDescription={
        <>
          Decodifique <strong style={{ color: "var(--text)" }}>Base64 de volta para texto</strong> legível, com
          suporte a UTF-8 e detecção de entradas inválidas.
        </>
      }
      schemaName="Base64 Decode"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como decodificar Base64",
        body: <p>Cole a string Base64 e veja o texto original na hora. Útil para inspecionar data URIs, payloads de tokens e dados embutidos em configurações.</p>,
      }}
      faq={FAQ}
      related={["base64-encode", "jwt-decoder", "json-formatter"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <Base64Tool mode="decode" />
    </ToolPage>
  );
}
