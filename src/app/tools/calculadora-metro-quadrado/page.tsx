import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import MetroQuadrado from './MetroQuadrado';

const DESC = 'Calcule o custo de materiais por metro quadrado para pisos, azulejos, tinta e revestimentos. Inclui desperdício. Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'calculadora-metro-quadrado',
  title: 'Calculadora de Custo por Metro Quadrado',
  description: DESC,
  keywords: ['calculadora metro quadrado', 'custo m2', 'calcular piso', 'calcular azulejo', 'preço por m2', 'tinta por metro quadrado'],
});

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-metro-quadrado"
      title="Custo por m²"
      emoji="📐"
      heroDescription={<>Calcule quantidade e custo de <strong style={{ color: 'var(--text)' }}>piso, azulejo ou tinta</strong> para uma área em m² com desperdício incluso.</>}
      schemaName="Calculadora de Custo por Metro Quadrado"
      schemaDescription={DESC}
      faq={[
        { q: 'Por que adicionar percentual de desperdício?', a: 'Ao cortar peças, há perdas inevitáveis. O padrão recomendado é 10% para pisos/azulejos em ambientes retangulares e até 15% para ambientes com muitos recortes.' },
        { q: 'Como calcular a área de uma parede?', a: 'Multiplique a largura pela altura da parede. Para múltiplas paredes, some os resultados. Subtraia portas e janelas.' },
        { q: 'O que é rendimento de tinta?', a: 'É a área coberta por litro de tinta em uma demão. O rendimento médio é de 10 a 12 m²/litro para tinta acrílica.' },
      ]}
      related={['area-tinta', 'calculadora-porcentagem', 'calculadora-energia']}
    >
      <MetroQuadrado />
    </ToolPage>
  );
}
