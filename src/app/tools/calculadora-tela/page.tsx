import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import TelaTool from './TelaTool';

const DESC = 'Calcule o PPI (pixels por polegada), diagonal e proporção de qualquer tela. Ideal para comparar monitores, TVs e celulares.';

export const metadata = toolMetadata({
  slug: 'calculadora-tela',
  title: 'Calculadora de Tela — Diagonal, PPI e Proporção',
  description: DESC,
  keywords: ['calculadora tela', 'ppi monitor', 'pixels por polegada', 'diagonal tela', 'resolução tela', 'comparar monitores'],
});

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-tela"
      title="Calculadora de Tela"
      emoji="🖥️"
      heroDescription={<>Calcule <strong style={{ color: 'var(--text)' }}>PPI, proporção e dimensões físicas</strong> de qualquer monitor, TV ou celular.</>}
      schemaName="Calculadora de PPI e Diagonal de Tela"
      schemaDescription={DESC}
      faq={[
        { q: 'O que é PPI?', a: 'PPI significa Pixels Per Inch (pixels por polegada). Quanto maior o PPI, mais nítida a imagem. Smartphones geralmente têm 300+ PPI, monitores profissionais 110-220 PPI.' },
        { q: 'Por que a diagonal em polegadas?', a: 'É o padrão da indústria de eletrônicos para medir tamanho de telas — a medida é feita na diagonal do painel.' },
        { q: 'O que é proporção de tela?', a: 'É a relação entre largura e altura da tela. 16:9 é o padrão widescreen. 21:9 é ultrawide. 4:3 foi o padrão antigo.' },
      ]}
      related={['conversor-unidades', 'calculadora-porcentagem', 'calculadora-metro-quadrado']}
    >
      <TelaTool />
    </ToolPage>
  );
}
