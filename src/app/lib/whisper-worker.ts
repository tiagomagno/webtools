// Web Worker que roda o pipeline Whisper (reconhecimento de fala) do
// @huggingface/transformers inteiramente no navegador. Mantém um pipeline
// em cache por modelo para não recarregar a cada transcrição, e permite
// pré-carregar o modelo em segundo plano antes do usuário pedir a transcrição.

import { pipeline, type AutomaticSpeechRecognitionPipeline } from "@huggingface/transformers";

const ctx = self as unknown as Worker;

interface TranscribeRequest {
  type: "transcribe";
  id: number;
  audio: Float32Array;
  model: string;
  language: string; // "auto" ou código do idioma (ex.: "portuguese")
}

interface PreloadRequest {
  type: "preload";
  model: string;
}

interface ProgressItem {
  status: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

const pipelineCache = new Map<string, Promise<AutomaticSpeechRecognitionPipeline>>();

function loadPipeline(model: string): Promise<AutomaticSpeechRecognitionPipeline> {
  let cached = pipelineCache.get(model);
  if (cached) return cached;

  cached = (
    pipeline("automatic-speech-recognition", model, {
      // Força q8 (int8) em vez do dtype "q4" escolhido por padrão para o
      // decoder, que falha ao criar a sessão ONNX (scale ausente) em
      // alguns modelos Whisper publicados no Hub.
      dtype: { encoder_model: "q8", decoder_model_merged: "fp16" },
      // O progresso é reportado por modelo (não por request) — assim a UI
      // consegue mostrar o download mesmo quando ele começou em segundo
      // plano, antes de qualquer pedido de transcrição.
      progress_callback: (data: ProgressItem) => {
        ctx.postMessage({ type: "progress", model, ...data });
      },
    }) as Promise<AutomaticSpeechRecognitionPipeline>
  ).catch((err) => {
    pipelineCache.delete(model); // permite tentar de novo em caso de falha
    throw err;
  });

  pipelineCache.set(model, cached);
  return cached;
}

ctx.addEventListener("message", async (event: MessageEvent<TranscribeRequest | PreloadRequest>) => {
  const msg = event.data;

  if (msg.type === "preload") {
    try {
      await loadPipeline(msg.model);
      ctx.postMessage({ type: "preload-done", model: msg.model });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      ctx.postMessage({ type: "preload-error", model: msg.model, message });
    }
    return;
  }

  if (msg.type !== "transcribe") return;
  const { id, audio, model, language } = msg;

  try {
    ctx.postMessage({ type: "status", id, message: "loading-model" });
    const transcriber = await loadPipeline(model);

    ctx.postMessage({ type: "status", id, message: "transcribing" });
    const output = await transcriber(audio, {
      language: language === "auto" ? undefined : language,
      chunk_length_s: 30,
      stride_length_s: 5,
    });

    const result = Array.isArray(output) ? output[0] : output;
    ctx.postMessage({ type: "result", id, text: (result?.text ?? "").trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    ctx.postMessage({ type: "error", id, message });
  }
});
