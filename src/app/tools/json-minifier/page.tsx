import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import JsonMinifier from './JsonMinifier';

const DESC = 'Minifique e compacte JSON removendo espaços e quebras de linha. Reduz o tamanho de arquivos JSON para produção. Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'json-minifier',
  title: 'Minificador de JSON',
  description: DESC,
  keywords: ['minificador json', 'compactar json', 'minify json', 'json minify online', 'reduzir json'],
});

export default function Page() {
  return (
    <ToolPage
      slug="json-minifier"
      title="Minificador de JSON"
      emoji="🗜️"
      heroDescription={<>Compacte JSON removendo espaços desnecessários — <strong style={{ color: 'var(--text)' }}>reduz o tamanho em até 80%</strong> para produção.</>}
      schemaName="Minificador de JSON Online"
      schemaDescription={DESC}
      faq={[
        { q: 'Por que minificar JSON?', a: 'JSON minificado ocupa menos espaço em transferências de rede e em arquivos de configuração de produção, melhorando a performance.' },
        { q: 'A minificação altera os dados?', a: 'Não. Apenas remove espaços, tabulações e quebras de linha — os dados permanecem idênticos.' },
        { q: 'Posso formatar de volta?', a: 'Sim, use o JSON Formatter para expandir e identar o JSON novamente.' },
      ]}
      related={['json-formatter', 'json-validator', 'css-minifier']}
    >
      <JsonMinifier />
    </ToolPage>
  );
}
