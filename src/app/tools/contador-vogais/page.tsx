import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import LetterFrequency from './LetterFrequency';

const DESC = 'Analise a frequência de vogais, consoantes e todas as letras de um texto. Veja quais letras aparecem mais. Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'contador-vogais',
  title: 'Contador de Vogais e Frequência de Letras',
  description: DESC,
  keywords: ['contador de vogais', 'frequência de letras', 'análise de texto', 'consoantes', 'distribuição de letras'],
});

export default function Page() {
  return (
    <ToolPage
      slug="contador-vogais"
      title="Frequência de Letras"
      emoji="🔤"
      heroDescription={<>Analise <strong style={{ color: 'var(--text)' }}>vogais, consoantes</strong> e a frequência de cada letra no seu texto.</>}
      schemaName="Analisador de Frequência de Letras"
      schemaDescription={DESC}
      faq={[
        { q: 'O que é análise de frequência de letras?', a: 'É a contagem de quantas vezes cada letra aparece num texto, útil em criptografia e linguística.' },
        { q: 'As letras acentuadas são contadas separadamente?', a: 'Sim, a análise agrupa por letra base (A inclui Á, À, Ã, Â, Ä).' },
        { q: 'Para que serve conhecer a frequência de letras?', a: 'É útil para decifrar textos cifrados, analisar padrões de escrita e estudar idiomas.' },
      ]}
      related={['contador-palavras', 'contador-caracteres', 'removedor-acentos']}
    >
      <LetterFrequency />
    </ToolPage>
  );
}
