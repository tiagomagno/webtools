import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import MorseTool from './MorseTool';

const DESC = 'Converta texto em código Morse e Morse em texto instantaneamente. Suporta letras, números e pontuação. Online, gratuito e sem instalação.';

export const metadata = toolMetadata({
  slug: 'texto-para-morse',
  title: 'Texto para Código Morse',
  description: DESC,
  keywords: ['código morse', 'conversor morse', 'texto para morse', 'morse para texto', 'traduzir morse'],
});

export default function Page() {
  return (
    <ToolPage
      slug="texto-para-morse"
      title="Texto para Código Morse"
      emoji="📡"
      heroDescription={<>Converta texto em <strong style={{ color: 'var(--text)' }}>Código Morse</strong> e Morse em texto instantaneamente.</>}
      schemaName="Conversor Texto para Código Morse"
      schemaDescription={DESC}
      faq={[
        { q: 'O que é o código Morse?', a: 'Sistema de comunicação que representa letras e números com sequências de pontos (.) e traços (-), separados por espaços.' },
        { q: 'Como separar as palavras em Morse?', a: 'Na codificação, palavras são separadas por "/" e letras por espaço simples.' },
        { q: 'A ferramenta suporta acentos?', a: 'Não — Morse não tem representação padrão para caracteres acentuados. Remova os acentos antes de codificar.' },
      ]}
      related={['formatador-texto', 'cifra-cesar', 'removedor-acentos']}
    >
      <MorseTool />
    </ToolPage>
  );
}
