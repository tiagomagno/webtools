import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import QrCodeTool from "./QrCodeTool";

const DESCRIPTION = "Crie QR Codes com cores e baixe em PNG ou SVG; leia QR Codes por imagem ou pela câmera, sem instalar app.";

export const metadata = toolMetadata({
  slug: "qr-code",
  title: "QR Code Online — Gerador e Leitor Grátis",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="qr-code"
      title="QR Code"
      heroDescription={<><strong style={{ color: "var(--text)" }}>Crie QR Codes</strong> com cores e baixe em PNG ou SVG, ou leia um QR por imagem ou câmera.</>}
      schemaName="QR Code"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["geradores", "codificadores"]}
    >
      <QrCodeTool />
    </ToolPage>
  );
}
