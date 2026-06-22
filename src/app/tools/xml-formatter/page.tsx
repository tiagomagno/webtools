import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import XmlFormatter from './XmlFormatter';

const DESC = 'Formate e identar XML de forma legível ou minifique para produção. Valida a estrutura do XML automaticamente. Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'xml-formatter',
  title: 'XML Formatter — Formatar e Identar XML',
  description: DESC,
  keywords: ['xml formatter', 'formatar xml', 'identar xml', 'xml beautifier', 'minificar xml', 'validar xml'],
});

export default function Page() {
  return (
    <ToolPage
      slug="xml-formatter"
      title="XML Formatter"
      emoji="📋"
      heroDescription={<>Formate, identar ou minifique XML com <strong style={{ color: 'var(--text)' }}>validação automática de estrutura</strong>.</>}
      schemaName="XML Formatter e Validador Online"
      schemaDescription={DESC}
      faq={[
        { q: 'O que é XML?', a: 'XML (eXtensible Markup Language) é uma linguagem de marcação usada para armazenar e transportar dados de forma estruturada e legível por humanos e máquinas.' },
        { q: 'Qual a diferença entre formatar e minificar?', a: 'Formatar adiciona espaços e quebras de linha para facilitar a leitura; minificar remove tudo isso para reduzir o tamanho em produção.' },
        { q: 'Dados sensíveis são enviados para algum servidor?', a: 'Não. Todo o processamento acontece no seu navegador, nenhum dado sai do seu dispositivo.' },
      ]}
      related={['json-formatter', 'html-formatter', 'json-minifier']}
    >
      <XmlFormatter />
    </ToolPage>
  );
}
