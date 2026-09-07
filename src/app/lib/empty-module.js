// Stub para módulos Node-only (sharp, onnxruntime-node) que o
// @huggingface/transformers referencia mas que nunca são usados no
// navegador (rodamos só o backend WASM/WebGPU dentro de um Web Worker).
module.exports = {};
