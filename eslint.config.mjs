import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Regras do React Compiler (eslint-plugin-react-hooks 6+) como AVISO, não erro: o projeto não usa o
      // compilador, e os casos apontados são padrões legítimos (ler localStorage após montar para não divergir
      // do SSR; refs lidos no render do ImageCropper/PdfToJpg). Reescrever exige refatorar o fluxo de cada
      // ferramenta e testar no navegador; os avisos seguem visíveis no `npm run lint`.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
  // server/ e electron/ são pacotes separados (outro tsconfig); public/ tem worker minificado.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "public/**",
    "server/**",
    "electron/**",
    "vitest.config.mts",
  ]),
]);

export default eslintConfig;
