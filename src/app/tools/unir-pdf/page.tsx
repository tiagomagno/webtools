import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import MergePdf from "./MergePdf";

const DESCRIPTION =
  "Una vários arquivos PDF em um só, na ordem que você definir, direto no navegador. Sem upload, sem marca d'água e sem cadastro.";

export const metadata = toolMetadata({
  slug: "unir-pdf",
  title: "Unir PDF Online — Juntar Vários PDFs em Um Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quantos PDFs posso unir?", a: "Não há limite imposto: adicione quantos arquivos quiser. O limite prático é a memória do navegador, já que tudo é processado localmente." },
  { q: "Posso escolher a ordem dos arquivos?", a: "Sim. Use as setas ↑ e ↓ para reordenar os PDFs antes de unir. As páginas seguem exatamente essa ordem." },
  { q: "A qualidade ou o conteúdo muda?", a: "Não. As páginas são copiadas exatamente como estão, sem recompressão — texto, imagens e formatação são preservados." },
  { q: "Funciona com PDFs protegidos por senha?", a: "PDFs com restrições simples costumam funcionar, mas arquivos totalmente criptografados que exigem senha para abrir não podem ser lidos." },
  { q: "Os arquivos são enviados para servidores?", a: "Não. A união acontece inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="unir-pdf"
      emoji="🔗"
      title="Unir PDF"
      heroDescription={
        <>
          Junte <strong style={{ color: "var(--text)" }}>vários PDFs em um único arquivo</strong>, na ordem que você
          escolher. Tudo no navegador, sem upload e sem marca d&apos;água.
        </>
      }
      schemaName="Unir PDF"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como unir arquivos PDF",
        body: (
          <p>
            Adicione dois ou mais PDFs, organize a ordem com as setas e clique em <strong>Unir PDFs</strong>. As páginas
            de cada arquivo são copiadas sequencialmente para um novo documento, sem perda de qualidade. O resultado é
            baixado direto no seu dispositivo.
          </p>
        ),
      }}
      faq={FAQ}
      related={["dividir-pdf", "jpg-para-pdf", "pdf-compressor"]}
      ctaText="Precisa de mais ferramentas de PDF?"
    >
      <MergePdf />
    </ToolPage>
  );
}
