import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import GasolinaVsAlcool from './GasolinaVsAlcool';

const DESC = 'Descubra se vale mais a pena abastecer com gasolina ou álcool (etanol). Calculadora baseada nos preços atuais e na regra dos 70%.';

export const metadata = toolMetadata({
  slug: 'gasolina-vs-alcool',
  title: 'Gasolina vs Álcool — Qual Compensa Abastecer?',
  description: DESC,
  keywords: ['gasolina vs alcool', 'gasolina ou alcool', 'etanol ou gasolina', 'qual compensa abastecer', 'regra 70 porcento alcool'],
});

export default function Page() {
  return (
    <ToolPage
      slug="gasolina-vs-alcool"
      title="Gasolina vs Álcool"
      emoji="⛽"
      heroDescription={<>Descubra qual combustível compensa mais usar com base na <strong style={{ color: 'var(--text)' }}>regra dos 70%</strong>.</>}
      schemaName="Calculadora Gasolina vs Álcool"
      schemaDescription={DESC}
      faq={[
        { q: 'Qual a regra dos 70%?', a: 'O álcool compensa quando seu preço é menor que 70% do preço da gasolina, pois o consumo do etanol é em média 30% maior.' },
        { q: 'Por que o carro gasta mais álcool?', a: 'O álcool tem menor densidade energética que a gasolina, então o motor precisa de mais combustível para gerar a mesma energia.' },
        { q: 'A regra dos 70% vale para todos os carros?', a: 'É uma boa aproximação. Carros mais modernos e flex podem ter uma proporção ligeiramente diferente. Alguns fabricantes informam 71% ou 72%.' },
      ]}
      related={['calculadora-combustivel', 'calculadora-porcentagem', 'calculadora-desconto']}
    >
      <GasolinaVsAlcool />
    </ToolPage>
  );
}
