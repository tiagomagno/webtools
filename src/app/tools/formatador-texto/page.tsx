import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import TextFormatter from "./TextFormatter";

const DESCRIPTION = "Transforme texto entre MAIÚSCULAS, minúsculas, Título, camelCase, snake_case, kebab-case e outros formatos em um clique. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "formatador-texto",
  title: "Formatador de Texto Online — MAIÚSCULAS, camelCase, snake_case e mais",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quais formatos estão disponíveis?", a: "MAIÚSCULAS, minúsculas, Título, Frase, camelCase, PascalCase, snake_case, kebab-case e alternado." },
  { q: "Para que serve camelCase?", a: "camelCase é usado em variáveis JavaScript. PascalCase em nomes de classes. snake_case em Python e banco de dados. kebab-case em CSS e URLs." },
  { q: "O texto é enviado ao servidor?", a: "Não. Toda a transformação acontece no navegador, localmente." },
  { q: "Funciona com acentos?", a: "Sim. Maiúsculas e minúsculas respeitam caracteres acentuados do português." },
];

export default function Page() {
  return (
    <ToolPage
      slug="formatador-texto"
      emoji="✏️"
      title="Formatador de Texto"
      heroDescription={<>Converta texto para <strong style={{ color: "var(--text)" }}>MAIÚSCULAS, minúsculas, camelCase, snake_case</strong> e outros formatos instantaneamente.</>}
      schemaName="Formatador de Texto"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Quando usar cada formato", body: <p>Use MAIÚSCULAS para siglas e destaque. snake_case e kebab-case são padrão em programação e URLs. camelCase é convencional em JavaScript; PascalCase em TypeScript e C#. O formato Título é ideal para cabeçalhos.</p> }}
      faq={FAQ}
      related={["inversor-texto", "removedor-acentos", "texto-para-slug"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <TextFormatter />
    </ToolPage>
  );
}
