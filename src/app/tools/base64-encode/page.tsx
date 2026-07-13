import ToolPage from "../../components/ToolPage";
import Base64Tool from "../../components/Base64Tool";
import { toolMetadata } from "../../lib/seo";

const DESCRIPTION =
  "Codifique e decodifique texto e arquivos em Base64 online com suporte completo a UTF-8 (acentos e emojis). Resultado em tempo real, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "base64-encode",
  title: "Ferramenta Base64 — Encode e Decode (UTF-8)",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="base64-encode"
      emoji="🔢"
      title="Ferramenta Base64"
      heroDescription={
        <>
          Codifique ou decodifique <strong style={{ color: "var(--text)" }}>textos em Base64</strong> com suporte completo a
          UTF-8 (acentos e emojis), em tempo real.
        </>
      }
      schemaName="Ferramenta Base64"
      schemaDescription={DESCRIPTION}
      faq={[]}
    >
      <Base64Tool />
    </ToolPage>
  );
}
