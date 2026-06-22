import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import Cronometro from './Cronometro';

const DESC = 'Cronômetro online com laps e timer/contador regressivo. Sem instalação, funciona no navegador. Ideal para esportes, estudos e produtividade.';

export const metadata = toolMetadata({
  slug: 'cronometro',
  title: 'Cronômetro Online — Stopwatch e Timer',
  description: DESC,
  keywords: ['cronômetro online', 'stopwatch', 'timer online', 'contador regressivo', 'cronômetro grátis', 'cronômetro web'],
});

export default function Page() {
  return (
    <ToolPage
      slug="cronometro"
      title="Cronômetro Online"
      emoji="⏱️"
      heroDescription={<><strong style={{ color: 'var(--text)' }}>Cronômetro com laps e timer regressivo</strong> — sem instalação, funciona direto no navegador.</>}
      schemaName="Cronômetro Online com Timer e Laps"
      schemaDescription={DESC}
      faq={[
        { q: 'O cronômetro continua se eu trocar de aba?', a: 'Sim, o tempo é calculado com base no horário do sistema, então continua mesmo com a aba em segundo plano.' },
        { q: 'Posso usar como timer regressivo?', a: 'Sim. Selecione a aba Timer, configure o tempo e clique em Iniciar.' },
        { q: 'As voltas (laps) são salvas?', a: 'As voltas ficam visíveis enquanto você mantiver a página aberta, mas não são salvas permanentemente.' },
      ]}
      related={['calculadora-horas', 'unix-timestamp', 'calculadora-datas']}
    >
      <Cronometro />
    </ToolPage>
  );
}
