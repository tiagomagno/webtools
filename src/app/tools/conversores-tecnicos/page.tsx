import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import ConversoresTecnicos from "./ConversoresTecnicos";

const DESCRIPTION = "Converta entre decimal, binário, octal e hexadecimal, timestamp Unix e data, consulte a tabela ASCII 0–255 e converta unidades CSS (px, rem, em, vw, vh e %).";

export const metadata = toolMetadata({
  slug: "conversores-tecnicos",
  title: "Conversores Técnicos — Bases, Timestamp Unix, ASCII e Unidades CSS",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="conversores-tecnicos"
      title="Conversores Técnicos"
      heroDescription={<>Converta <strong style={{ color: "var(--text)" }}>bases numéricas</strong>, timestamps Unix, caracteres ASCII e unidades CSS num só lugar.</>}
      schemaName="Conversores Técnicos"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["regex-cron", "calculadoras"]}
    >
      <ConversoresTecnicos />
    </ToolPage>
  );
}
