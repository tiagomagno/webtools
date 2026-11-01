import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import RegexCron from "./RegexCron";

const DESCRIPTION = "Teste expressões regulares em tempo real com destaque de matches e traduza expressões cron para português, vendo as próximas execuções.";

export const metadata = toolMetadata({
  slug: "regex-cron",
  title: "Testador de Regex e Leitor de Cron Online",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="regex-cron"
      title="Regex e Cron"
      heroDescription={<>Teste <strong style={{ color: "var(--text)" }}>expressões regulares</strong> com destaque dos matches e traduza expressões cron para português.</>}
      schemaName="Regex e Cron"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["formatador-dados", "conversores-tecnicos"]}
    >
      <RegexCron />
    </ToolPage>
  );
}
