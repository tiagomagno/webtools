import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import BaseConverter from "./BaseConverter";

const DESCRIPTION = "Converta números entre decimal, binário, octal e hexadecimal instantaneamente. Veja todos os formatos ao mesmo tempo. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "conversor-bases",
  title: "Conversor de Bases Numéricas — Decimal, Binário, Octal e Hex",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quais bases são suportadas?", a: "Decimal (base 10), Binário (base 2), Octal (base 8) e Hexadecimal (base 16). Insira o valor em qualquer base e veja os outros automaticamente." },
  { q: "Funciona com números negativos?", a: "Não. O conversor suporta apenas inteiros não-negativos. Para números com sinal, a representação depende do tamanho de palavra (8, 16, 32 bits)." },
  { q: "O que é hexadecimal?", a: "Base 16, usa os dígitos 0-9 e as letras A-F. Muito usado em cores CSS (#FF5733), endereços de memória e códigos de erro." },
];

export default function Page() {
  return (
    <ToolPage
      slug="conversor-bases"
      emoji="🔢"
      title="Conversor de Bases"
      heroDescription={<>Converta entre <strong style={{ color: "var(--text)" }}>decimal, binário, octal e hexadecimal</strong> instantaneamente.</>}
      schemaName="Conversor de Bases Numéricas"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Quando usar o conversor de bases", body: <p>Indispensável para programadores que trabalham com cores (hex), manipulação de bits (binário), permissões Unix (octal) ou depuração de memória. O conversor mostra todos os formatos de uma vez para agilizar o desenvolvimento.</p> }}
      faq={FAQ}
      related={["hash-generator", "base64-encode", "jwt-decoder"]}
      ctaText="Precisa de mais ferramentas de Dev?"
    >
      <BaseConverter />
    </ToolPage>
  );
}
