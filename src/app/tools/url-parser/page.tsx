import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import UrlParser from './UrlParser';

const DESC = 'Decomponha qualquer URL em suas partes: protocolo, host, porta, path, query string e hash. Decodifica parâmetros automaticamente.';

export const metadata = toolMetadata({
  slug: 'url-parser',
  title: 'Parser de URL — Decompor e Analisar URLs',
  description: DESC,
  keywords: ['parser url', 'analisar url', 'decompor url', 'query string', 'url decode', 'partes da url'],
});

export default function Page() {
  return (
    <ToolPage
      slug="url-parser"
      title="Parser de URL"
      emoji="🔗"
      heroDescription={<>Decomponha qualquer URL em <strong style={{ color: 'var(--text)' }}>protocolo, host, path, parâmetros e hash</strong> instantaneamente.</>}
      schemaName="Parser e Analisador de URL"
      schemaDescription={DESC}
      faq={[
        { q: 'O que é uma query string?', a: 'É a parte da URL após o "?" que contém parâmetros no formato chave=valor, como ?page=1&search=texto.' },
        { q: 'O que é o hash de uma URL?', a: 'É o fragmento após "#", usado para navegação dentro da página (âncoras). Não é enviado ao servidor.' },
        { q: 'Os parâmetros são decodificados automaticamente?', a: 'Sim, caracteres codificados como %20 são convertidos para seus equivalentes legíveis.' },
      ]}
      related={['codificador-url', 'gerador-utm', 'open-graph-preview']}
    >
      <UrlParser />
    </ToolPage>
  );
}
