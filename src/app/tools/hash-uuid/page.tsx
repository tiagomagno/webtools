import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import HashUuid from "./HashUuid";

const DESCRIPTION = "Gere hashes MD5, SHA-1, SHA-256, SHA-384 e SHA-512 e UUIDs v4 únicos, individualmente ou até 10.000 de uma vez para baixar em .txt.";

export const metadata = toolMetadata({
  slug: "hash-uuid",
  title: "Gerador de Hash e UUID Online — MD5, SHA-256 e UUID v4",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="hash-uuid"
      title="Hash e UUID"
      heroDescription={<>Gere hashes <strong style={{ color: "var(--text)" }}>MD5, SHA-1, SHA-256, SHA-384 e SHA-512</strong> e UUIDs v4, um a um ou em massa.</>}
      schemaName="Hash e UUID"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["codificadores", "geradores"]}
    >
      <HashUuid />
    </ToolPage>
  );
}
