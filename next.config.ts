import type { NextConfig } from "next";

// Build usado só para empacotar o app Electron: gera export estático (sem
// servidor Next por trás) porque o app desktop só abre o HTML/JS local e
// fala com a API (webtools/server) diretamente. O site público continua
// como servidor Next normal (output "standalone"), sem mudar nada aqui.
const isElectronBuild = process.env.BUILD_TARGET === "electron";

// As 20 calculadoras foram unificadas em /tools/calculadoras (com abas).
// Mantém as URLs antigas funcionando via redirect permanente para a aba certa.
const CALCULATOR_SLUGS = [
  "calculadora-idade",
  "calculadora-imc",
  "calculadora-porcentagem",
  "calculadora-desconto",
  "juros-compostos",
  "juros-simples",
  "calculadora-datas",
  "calculadora-horas",
  "conversor-tempo",
  "conversor-temperatura",
  "conversor-unidades",
  "calculadora-metro-quadrado",
  "calculadora-tela",
  "calculadora-combustivel",
  "gasolina-vs-alcool",
  "calculadora-energia",
  "calculadora-gorjeta",
  "regra-de-tres",
  "calculadora-calorias",
  "calculadora-macros",
];

const nextConfig: NextConfig = {
  output: isElectronBuild ? "export" : "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  // Export estático não aceita redirects() (nem função vazia) — o app
  // desktop não tem as URLs antigas das calculadoras pra redirecionar mesmo.
  ...(!isElectronBuild && {
    async redirects() {
      return CALCULATOR_SLUGS.map((slug) => ({
        source: `/tools/${slug}`,
        destination: `/tools/calculadoras?tipo=${slug}`,
        permanent: true,
      }));
    },
  }),
  // @huggingface/transformers só é usado no navegador (Web Worker) nesta
  // app; evita que o Turbopack resolva os backends Node-only da lib.
  turbopack: {
    root: __dirname,
    resolveAlias: {
      sharp: "./src/app/lib/empty-module.js",
      "onnxruntime-node": "./src/app/lib/empty-module.js",
    },
  },
};

export default nextConfig;
