import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import ExtractColors from './ExtractColors';

const DESC = 'Extraia as cores dominantes de qualquer imagem e veja a paleta de cores em HEX e RGB. Ideal para designers. Online, gratuito e sem upload.';

export const metadata = toolMetadata({
  slug: 'extrator-cores',
  title: 'Extrator de Cores de Imagem — Paleta Dominante',
  description: DESC,
  keywords: ['extrator de cores', 'paleta de cores imagem', 'cores dominantes', 'extrair cores foto', 'color picker imagem'],
});

export default function Page() {
  return (
    <ToolPage
      slug="extrator-cores"
      title="Extrator de Cores de Imagem"
      emoji="🌈"
      heroDescription={<>Extraia as <strong style={{ color: 'var(--text)' }}>cores dominantes</strong> de qualquer imagem e gere a paleta em HEX e RGB.</>}
      schemaName="Extrator de Cores de Imagem"
      schemaDescription={DESC}
      faq={[
        { q: 'Como funciona a extração de cores?', a: 'A ferramenta usa o Canvas do navegador para amostrar pixels da imagem e agrupa as cores mais frequentes em clusters.' },
        { q: 'A imagem é enviada para algum servidor?', a: 'Não. Todo o processamento é feito localmente no seu navegador usando a API Canvas.' },
        { q: 'Quais formatos de imagem são suportados?', a: 'JPG, PNG, WebP, GIF e SVG — qualquer formato que o seu navegador consiga exibir.' },
      ]}
      related={['conversor-cores', 'color-generator', 'compressor-imagem']}
    >
      <ExtractColors />
    </ToolPage>
  );
}
