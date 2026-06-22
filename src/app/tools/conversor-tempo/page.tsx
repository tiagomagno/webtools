import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import ConversorTempo from './ConversorTempo';

const DESC = 'Converta entre segundos, minutos, horas, dias, semanas, meses e anos. Conversor de unidades de tempo online e gratuito.';

export const metadata = toolMetadata({
  slug: 'conversor-tempo',
  title: 'Conversor de Tempo — Segundos, Minutos, Horas, Dias',
  description: DESC,
  keywords: ['conversor de tempo', 'converter segundos para horas', 'converter minutos', 'unidades de tempo', 'horas para segundos', 'dias para horas'],
});

export default function Page() {
  return (
    <ToolPage
      slug="conversor-tempo"
      title="Conversor de Tempo"
      emoji="🕐"
      heroDescription={<>Converta qualquer valor entre <strong style={{ color: 'var(--text)' }}>segundos, minutos, horas, dias, semanas e anos</strong>.</>}
      schemaName="Conversor de Unidades de Tempo"
      schemaDescription={DESC}
      faq={[
        { q: 'Quantos segundos tem um dia?', a: '86.400 segundos (24h × 60min × 60s).' },
        { q: 'Quantas horas tem um ano?', a: 'Aproximadamente 8.760 horas (365 dias × 24h), ou 8.784 em anos bissextos.' },
        { q: 'A conversão para meses é exata?', a: 'A ferramenta usa 30,44 dias por mês (média anual). Para cálculos exatos, prefira dias ou horas.' },
      ]}
      related={['calculadora-horas', 'unix-timestamp', 'calculadora-datas']}
    >
      <ConversorTempo />
    </ToolPage>
  );
}
