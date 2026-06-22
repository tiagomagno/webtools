import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import AnagramaTool from './AnagramaTool';

const DESC = 'Gere anagramas embaralhando as letras de uma palavra ou frase. Online, gratuito e instantâneo.';

export const metadata = toolMetadata({
  slug: 'gerador-anagrama',
  title: 'Gerador de Anagramas',
  description: DESC,
  keywords: ['gerador de anagrama', 'embaralhar letras', 'anagrama online', 'jogar com palavras', 'embaralhar palavras'],
});

export default function Page() {
  return (
    <ToolPage
      slug="gerador-anagrama"
      title="Gerador de Anagramas"
      emoji="🔀"
      heroDescription={<>Embaralhe as letras de uma <strong style={{ color: 'var(--text)' }}>palavra ou frase</strong> para criar anagramas aleatórios.</>}
      schemaName="Gerador de Anagramas Online"
      schemaDescription={DESC}
      faq={[
        { q: 'O que é um anagrama?', a: 'É uma palavra ou frase formada pela reorganização das letras de outra palavra, usando todas as letras originais exatamente uma vez.' },
        { q: 'Como usar esta ferramenta?', a: 'Digite uma palavra ou frase e clique em "Embaralhar". Cada clique gera uma permutação diferente.' },
        { q: 'Espaços são preservados?', a: 'Sim, os espaços entre palavras são mantidos na mesma posição.' },
      ]}
      related={['formatador-texto', 'ordenador-linhas', 'cifra-cesar']}
    >
      <AnagramaTool />
    </ToolPage>
  );
}
