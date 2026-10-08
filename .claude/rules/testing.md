# Testes
Vitest 4 (ambiente Node, sem DOM). Rodar: `npm test` (`vitest run`). Config em `vitest.config.mts`.

- Testes dos utils puros ficam em `src/app/lib/__tests__/<assunto>.test.ts`; importam de `../<util>`.
- Todo util novo em `src/app/lib/` que faça cálculo, validação ou conversão ganha teste na mesma tarefa.
- **Valores esperados vêm de fontes externas** (vetores de RFC/FIPS, tabelas oficiais, exemplos calculados à mão), nunca da saída atual do código. Foi assim que o bug do gerador de cartão (Luhn) apareceu.
- Funções aleatórias (CPF, CNPJ, cartão, UUID) testam a propriedade (o gerado passa na validação) em várias amostras.
- Componentes React e fluxos de login não têm teste automatizado ainda; validar por `npm run build` e conferência manual. Teste ponta a ponta do login é tarefa separada.

## Assim sim
```ts
import { describe, expect, it } from "vitest";
import { hashText } from "../hash";

describe("hashText", () => {
  it.each([
    ["", "d41d8cd98f00b204e9800998ecf8427e"],
    ["abc", "900150983cd24fb0d6963f7d28e17f72"], // vetores do RFC 1321
  ])("MD5(%j)", async (texto, esperado) => {
    expect(await hashText(texto, "MD5")).toBe(esperado);
  });
});
```
