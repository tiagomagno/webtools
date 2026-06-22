import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import ImageToBase64 from './ImageToBase64';

const DESC = 'Converta imagens para Base64 e Base64 de volta para imagem. Suporta PNG, JPG, GIF, WebP e SVG. Online e gratuito, sem upload para servidor.';

export const metadata = toolMetadata({
  slug: 'image-to-base64',
  title: 'Imagem para Base64 — Converter Online',
  description: DESC,
  keywords: ['imagem para base64', 'converter imagem base64', 'base64 imagem online', 'base64 decode imagem', 'data uri imagem'],
});

export default function Page() {
  return (
    <ToolPage
      slug="image-to-base64"
      title="Imagem para Base64"
      emoji="🖼️"
      heroDescription={<>Converta imagens para <strong style={{ color: 'var(--text)' }}>strings Base64 (data URI)</strong> e Base64 de volta para imagem — 100% local.</>}
      schemaName="Conversor Imagem para Base64"
      schemaDescription={DESC}
      faq={[
        { q: 'Para que serve converter imagem para Base64?', a: 'Imagens em Base64 podem ser embutidas diretamente em HTML, CSS ou JSON, eliminando requisições HTTP extras para pequenas imagens.' },
        { q: 'Há limite de tamanho?', a: 'Não há limite de servidor pois o processamento é local. Porém, imagens muito grandes geram strings enormes e podem tornar o código fonte pesado.' },
        { q: 'A imagem vai para algum servidor?', a: 'Não. Todo o processamento ocorre no seu navegador usando a File API.' },
      ]}
      related={['base64-encode', 'compressor-imagem', 'extrator-cores']}
    >
      <ImageToBase64 />
    </ToolPage>
  );
}
