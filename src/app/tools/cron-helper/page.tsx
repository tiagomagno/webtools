import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import CronHelper from './CronHelper';

const DESC = 'Explique expressões cron em português e veja as próximas execuções. Gere expressões a partir de descrições comuns. Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'cron-helper',
  title: 'Leitor de Expressões Cron — Explicar Cron em Português',
  description: DESC,
  keywords: ['cron expression', 'expressão cron', 'leitor cron', 'cron schedule', 'crontab', 'agendamento linux'],
});

export default function Page() {
  return (
    <ToolPage
      slug="cron-helper"
      title="Leitor de Cron"
      emoji="⏱️"
      heroDescription={<>Entenda <strong style={{ color: 'var(--text)' }}>expressões cron em português</strong> e veja as próximas execuções agendadas.</>}
      schemaName="Leitor e Tradutor de Expressões Cron"
      schemaDescription={DESC}
      faq={[
        { q: 'O que é uma expressão cron?', a: 'Uma expressão cron define um horário de agendamento para tarefas. É composta por 5 campos: minuto, hora, dia do mês, mês e dia da semana.' },
        { q: 'O que significa * (asterisco) em cron?', a: 'O asterisco significa "qualquer valor". Por exemplo, * no campo de hora significa "toda hora".' },
        { q: 'Posso usar cron para rodar algo todo dia?', a: 'Sim. A expressão "0 9 * * *" roda todos os dias às 9:00.' },
      ]}
      related={['unix-timestamp', 'calculadora-horas', 'calculadora-datas']}
    >
      <CronHelper />
    </ToolPage>
  );
}
