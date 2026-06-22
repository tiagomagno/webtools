import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import ColorGenerator from './ColorGenerator';

const DESC = 'Gere paletas de cores harmônicas aleatoriamente. Copie em HEX, RGB ou HSL. Ideal para designers e desenvolvedores web.';

export const metadata = toolMetadata({
  slug: 'color-generator',
  title: 'Gerador de Paleta de Cores',
  description: DESC,
  keywords: ['gerador paleta cores', 'paleta aleatória', 'cores harmônicas', 'color palette generator', 'esquema de cores', 'cores para design'],
});

export default function Page() {
  return (
    <ToolPage
      slug="color-generator"
      title="Gerador de Paleta de Cores"
      emoji="🎨"
      heroDescription={<>Gere <strong style={{ color: 'var(--text)' }}>paletas de cores aleatórias e harmônicas</strong> com HEX, RGB e HSL — trave as que gostar.</>}
      schemaName="Gerador de Paleta de Cores Online"
      schemaDescription={DESC}
      faq={[
        { q: 'O que são cores harmônicas?', a: 'São combinações de cores baseadas em relações matemáticas na roda de cores: complementares, análogas, tríades e etc.' },
        { q: 'Como copiar a cor?', a: 'Clique no código HEX, RGB ou HSL de qualquer cor para copiar para a área de transferência.' },
        { q: 'Posso fixar uma cor e gerar outras?', a: 'Sim, clique no cadeado de uma cor para travá-la — ela será mantida ao gerar nova paleta.' },
      ]}
      related={['conversor-cores', 'gerador-qr', 'extrator-cores']}
    >
      <ColorGenerator />
    </ToolPage>
  );
}
