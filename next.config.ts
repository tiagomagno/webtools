import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  // @huggingface/transformers só é usado no navegador (Web Worker) nesta
  // app; evita que o Turbopack resolva os backends Node-only da lib.
  turbopack: {
    resolveAlias: {
      sharp: "./src/app/lib/empty-module.js",
      "onnxruntime-node": "./src/app/lib/empty-module.js",
    },
  },
};

export default nextConfig;
