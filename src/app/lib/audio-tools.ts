// Utilitários compartilhados da ferramenta "Transcrição de Áudio".
// Decodifica e reamostra áudio no navegador para o formato esperado pelo
// Whisper: Float32Array mono a 16kHz.

export const WHISPER_SAMPLE_RATE = 16000;

export const SUPPORTED_AUDIO_EXT = [".mp3", ".wav", ".m4a", ".ogg", ".webm", ".flac", ".aac"];

export function isSupportedAudioFile(file: File): boolean {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("audio/")) return true;
  return SUPPORTED_AUDIO_EXT.some((ext) => name.endsWith(ext));
}

export function fmtDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function fmtBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Decodifica um Blob de áudio (upload ou gravação) e retorna um
 * Float32Array mono, reamostrado para 16kHz — formato de entrada do
 * pipeline de reconhecimento de fala do Whisper.
 */
export async function decodeAudioToFloat32Mono16k(blob: Blob): Promise<Float32Array> {
  const arrayBuffer = await blob.arrayBuffer();
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const decodeCtx = new AudioCtx();
  let decoded: AudioBuffer;
  try {
    decoded = await decodeCtx.decodeAudioData(arrayBuffer);
  } finally {
    decodeCtx.close();
  }

  // Downmix para mono (média dos canais).
  const numChannels = decoded.numberOfChannels;
  const mono = new Float32Array(decoded.length);
  for (let ch = 0; ch < numChannels; ch++) {
    const data = decoded.getChannelData(ch);
    for (let i = 0; i < data.length; i++) mono[i] += data[i] / numChannels;
  }

  if (decoded.sampleRate === WHISPER_SAMPLE_RATE) {
    return mono;
  }

  // Reamostra para 16kHz usando OfflineAudioContext.
  const duration = mono.length / decoded.sampleRate;
  const offline = new OfflineAudioContext(1, Math.ceil(duration * WHISPER_SAMPLE_RATE), WHISPER_SAMPLE_RATE);
  const buffer = offline.createBuffer(1, mono.length, decoded.sampleRate);
  buffer.copyToChannel(mono, 0);
  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.connect(offline.destination);
  source.start(0);
  const rendered = await offline.startRendering();
  return rendered.getChannelData(0);
}

export interface MicRecorder {
  stream: MediaStream;
  stop: () => Promise<Blob>;
}

/** Pede permissão do microfone e começa a gravar. Chame `stop()` para finalizar. */
export async function startMicRecording(): Promise<MicRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const chunks: BlobPart[] = [];
  const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const stopped = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
  });

  recorder.start();

  return {
    stream,
    stop: async () => {
      recorder.stop();
      stream.getTracks().forEach((t) => t.stop());
      return stopped;
    },
  };
}
