import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import QrGenerator from "./QrGenerator";

const DESCRIPTION =
  "Gere QR Codes de texto, links, Wi-Fi ou contato, com cores e tamanho personalizados. Baixe em PNG ou SVG. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "gerador-qr",
  title: "Gerador de QR Code Online — Criar QR Grátis (PNG e SVG)",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que posso colocar em um QR Code?", a: "Qualquer texto: uma URL, um e-mail, um número de telefone, dados de Wi-Fi ou um texto livre. Ao escanear, o aparelho lê exatamente o conteúdo informado." },
  { q: "O que é o nível de correção de erro?", a: "É a capacidade do QR de continuar legível mesmo danificado ou com um logo no centro. Quanto maior (L→H), mais robusto, porém mais denso o código." },
  { q: "Posso mudar as cores?", a: "Sim. Escolha a cor da frente e do fundo. Mantenha bom contraste (escuro sobre claro) para garantir a leitura." },
  { q: "PNG ou SVG: qual baixar?", a: "PNG é uma imagem pronta para usar. SVG é vetorial, ideal para impressão em qualquer tamanho sem perder qualidade." },
  { q: "O conteúdo é enviado para servidores?", a: "Não. O QR Code é gerado inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="gerador-qr"
      emoji="🔳"
      title="Gerador de QR Code"
      heroDescription={
        <>
          Crie <strong style={{ color: "var(--text)" }}>QR Codes</strong> de texto, links ou contato, com cores e
          tamanho personalizados. Baixe em PNG ou SVG, tudo no navegador.
        </>
      }
      schemaName="Gerador de QR Code"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como gerar um QR Code",
        body: <p>Digite o texto ou link, ajuste tamanho, nível de correção de erro e cores. O QR é atualizado em tempo real. Baixe em PNG para uso digital ou SVG para impressão. Todo o processamento é local.</p>,
      }}
      faq={FAQ}
      related={["leitor-qr", "gerador-senha", "texto-para-slug"]}
      ctaText="Precisa de mais utilidades?"
    >
      <QrGenerator />
    </ToolPage>
  );
}
