import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import QrReader from "./QrReader";

const DESCRIPTION =
  "Leia QR Codes de uma imagem ou pela câmera do dispositivo e veja o conteúdo na hora. Grátis, sem upload e sem instalar app.";

export const metadata = toolMetadata({
  slug: "leitor-qr",
  title: "Leitor de QR Code Online — Ler QR por Imagem ou Câmera",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como ler um QR Code?", a: "Envie uma imagem que contenha o QR (foto ou captura de tela) ou clique em 'Ler com a câmera' para escanear ao vivo. O conteúdo aparece automaticamente." },
  { q: "Funciona pela câmera do celular?", a: "Sim. Ao autorizar o acesso, a câmera traseira é usada para escanear em tempo real, direto no navegador." },
  { q: "Preciso instalar algum app?", a: "Não. A leitura acontece no próprio navegador, sem instalar nada e sem cadastro." },
  { q: "A imagem é enviada para servidores?", a: "Não. Tanto a imagem quanto o vídeo da câmera são processados localmente; nada é enviado para a internet." },
  { q: "Por que meu QR não foi reconhecido?", a: "Verifique se o código está nítido, bem iluminado e completo na imagem. QR muito pequeno, borrado ou cortado pode não ser detectado." },
];

export default function Page() {
  return (
    <ToolPage
      slug="leitor-qr"
      emoji="🔍"
      title="Leitor de QR Code"
      heroDescription={
        <>
          Leia <strong style={{ color: "var(--text)" }}>QR Codes</strong> de uma imagem ou pela câmera do dispositivo
          e veja o conteúdo na hora. Sem upload e sem instalar app.
        </>
      }
      schemaName="Leitor de QR Code"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como ler um QR Code online",
        body: <p>Arraste uma imagem com o QR ou use a câmera para escanear em tempo real. O conteúdo decodificado aparece abaixo, com botão para copiar e, se for um link, para abrir diretamente. Todo o processamento é feito no seu navegador.</p>,
      }}
      faq={FAQ}
      related={["gerador-qr", "base64-decode", "jwt-decoder"]}
      ctaText="Precisa de mais utilidades?"
    >
      <QrReader />
    </ToolPage>
  );
}
