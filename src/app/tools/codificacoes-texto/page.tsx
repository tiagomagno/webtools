import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CodificacoesTexto from "./CodificacoesTexto";

const DESCRIPTION = "Converta números para extenso em português, texto em código Morse (e de volta) e codifique ou decodifique com a cifra de César e ROT13.";

export const metadata = toolMetadata({
  slug: "codificacoes-texto",
  title: "Número por Extenso, Código Morse e Cifra de César Online",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="codificacoes-texto"
      title="Codificações de Texto"
      heroDescription={<>Escreva <strong style={{ color: "var(--text)" }}>números por extenso</strong>, converta texto em <strong style={{ color: "var(--text)" }}>código Morse</strong> e use a cifra de César.</>}
      schemaName="Codificações de Texto"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["editor-texto", "codificadores"]}
    >
      <CodificacoesTexto />
    </ToolPage>
  );
}
