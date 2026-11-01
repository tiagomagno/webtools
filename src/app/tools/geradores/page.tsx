import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import Geradores from "./Geradores";

const DESCRIPTION = "Gere senhas fortes com medidor de força, texto Lorem Ipsum, anagramas e sorteie nomes ou números, com ou sem repetição.";

export const metadata = toolMetadata({
  slug: "geradores",
  title: "Geradores Online — Senha, Lorem Ipsum, Anagrama e Sorteador",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="geradores"
      title="Geradores"
      heroDescription={<>Gere <strong style={{ color: "var(--text)" }}>senhas fortes</strong>, texto Lorem Ipsum, anagramas e faça sorteios de nomes ou números.</>}
      schemaName="Geradores"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["qr-code", "hash-uuid"]}
    >
      <Geradores />
    </ToolPage>
  );
}
