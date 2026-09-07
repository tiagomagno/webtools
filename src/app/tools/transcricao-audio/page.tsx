"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  decodeAudioToFloat32Mono16k,
  fmtDuration,
  isSupportedAudioFile,
  startMicRecording,
  type MicRecorder,
} from "@/app/lib/audio-tools";

type Mode = "record" | "upload";
type Status = "idle" | "loading-model" | "transcribing" | "done" | "error";

const MODELS = [
  { id: "onnx-community/whisper-tiny", label: "Rápido", hint: "~70 MB · menor precisão" },
  { id: "onnx-community/whisper-base", label: "Preciso", hint: "~130 MB · melhor qualidade" },
] as const;

const LANGUAGES = [
  { id: "auto", label: "Detectar automaticamente" },
  { id: "portuguese", label: "Português" },
  { id: "english", label: "Inglês" },
  { id: "spanish", label: "Espanhol" },
] as const;

interface ProgressFile {
  loaded: number;
  total: number;
}

export default function TranscricaoAudioPage() {
  const [mode, setMode] = useState<Mode>("record");
  const [model, setModel] = useState<string>(MODELS[1].id);
  const [language, setLanguage] = useState<string>("portuguese");

  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Estado do modelo (carregado silenciosamente em segundo plano, assim que
  // a página abre ou o modelo escolhido muda — não bloqueia nada sozinho).
  const [modelReady, setModelReady] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);

  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const micRef = useRef<MicRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressFilesRef = useRef<Map<string, ProgressFile>>(new Map());
  const preloadedModelRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("../../lib/whisper-worker.ts", import.meta.url), { type: "module" });
    }
    return workerRef.current;
  }, []);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pré-carrega o modelo escolhido assim que a página abre / o modelo muda,
  // em segundo plano — sem mostrar nada na tela. Se o usuário terminar de
  // gravar/enviar antes disso acabar, a barra de progresso aparece já a
  // partir de onde o download estava, em vez de começar do zero.
  useEffect(() => {
    if (preloadedModelRef.current === model) return;
    preloadedModelRef.current = model;
    setModelReady(false);
    setModelProgress(0);
    progressFilesRef.current.clear();
    getWorker().postMessage({ type: "preload", model });
  }, [model, getWorker]);

  // Listener global: acompanha o progresso/conclusão do carregamento do
  // modelo, independente de haver uma transcrição em andamento.
  useEffect(() => {
    const worker = getWorker();
    const onModelMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data.model !== model) return;

      if (data.type === "progress") {
        if (typeof data.total === "number" && data.file) {
          progressFilesRef.current.set(data.file, { loaded: data.loaded ?? 0, total: data.total });
          let loaded = 0;
          let total = 0;
          for (const f of progressFilesRef.current.values()) {
            loaded += f.loaded;
            total += f.total;
          }
          setModelProgress(total > 0 ? Math.round((loaded / total) * 100) : 0);
        }
      } else if (data.type === "preload-done") {
        setModelReady(true);
        setModelProgress(100);
      }
    };
    worker.addEventListener("message", onModelMessage);
    return () => worker.removeEventListener("message", onModelMessage);
  }, [model, getWorker]);

  const resetOutput = () => {
    setStatus("idle");
    setResult("");
    setError(null);
  };

  const setAudioSource = (blob: Blob, name: string | null) => {
    setAudioBlob(blob);
    setFileName(name);
    resetOutput();
  };

  // --- Gravação ---
  const startRecording = async () => {
    resetOutput();
    try {
      micRef.current = await startMicRecording();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      setError("Não foi possível acessar o microfone. Verifique a permissão no navegador.");
    }
  };

  const stopRecording = async () => {
    if (!micRef.current) return;
    const blob = await micRef.current.stop();
    micRef.current = null;
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setAudioSource(blob, null);
    transcribe(blob);
  };

  // --- Upload ---
  const handleFile = (file: File) => {
    if (!isSupportedAudioFile(file)) {
      setError("Formato não suportado. Envie um arquivo de áudio (MP3, WAV, M4A, OGG, WEBM, FLAC, AAC).");
      return;
    }
    setAudioSource(file, file.name);
    transcribe(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // --- Transcrição ---
  const transcribe = useCallback(async (blob: Blob) => {
    resetOutput();
    setStatus("loading-model");

    const id = ++requestIdRef.current;
    const worker = getWorker();

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data.id !== id) return;

      if (data.type === "status") {
        setStatus(data.message === "transcribing" ? "transcribing" : "loading-model");
      } else if (data.type === "result") {
        setResult(data.text || "_Nenhuma fala reconhecida no áudio._");
        setStatus("done");
        worker.removeEventListener("message", onMessage);
      } else if (data.type === "error") {
        const isNetworkIssue = /network|fetch|failed to fetch/i.test(data.message);
        setError(
          isNetworkIssue
            ? "Falha ao baixar o modelo de transcrição (erro de rede). Isso baixa arquivos de um CDN externo (Hugging Face) — verifique sua conexão, ou se algum bloqueador de anúncios/extensão do navegador está bloqueando o domínio huggingface.co, e tente de novo."
            : `Falha na transcrição: ${data.message}`
        );
        setStatus("error");
        worker.removeEventListener("message", onMessage);
      }
    };
    worker.addEventListener("message", onMessage);

    try {
      const audio = await decodeAudioToFloat32Mono16k(blob);
      worker.postMessage({ type: "transcribe", id, audio, model, language }, [audio.buffer]);
    } catch {
      setError("Não foi possível decodificar o áudio. O arquivo pode estar corrompido.");
      setStatus("error");
      worker.removeEventListener("message", onMessage);
    }
  }, [model, language, getWorker]);

  const retry = () => {
    if (audioBlob) transcribe(audioBlob);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadTxt = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(fileName ?? "transcricao").replace(/\.[^.]+$/, "")}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const busy = status === "loading-model" || status === "transcribing";
  // Só mostra a etapa de "carregando modelo" se ele realmente ainda não
  // estiver pronto — quando o pré-carregamento em segundo plano já
  // terminou (caso comum, especialmente em visitas seguintes), pula direto
  // para "transcrevendo".
  const showModelLoading = status === "loading-model" && !modelReady;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🎙️ Transcrição de Áudio
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Grave ou envie um áudio e receba o texto transcrito. Roda o modelo Whisper{" "}
          <strong style={{ color: "var(--text)" }}>inteiramente no seu navegador</strong> — sem upload para servidores.{" "}
          <span style={{ color: "var(--text-subtle)" }}>O modelo carrega em segundo plano assim que a página abre.</span>
        </p>
      </div>

      {/* Tabs de modo */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["record", "upload"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); resetOutput(); }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${mode === m ? "var(--accent)" : "var(--border)"}`,
              background: mode === m ? "var(--accent)" : "var(--surface)",
              color: mode === m ? "#fff" : "var(--text-muted)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {m === "record" ? "🎙️ Gravar" : "📁 Enviar arquivo"}
          </button>
        ))}
      </div>

      {/* Controles de modelo/idioma */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Modelo</div>
          <div style={{ display: "flex", gap: 6 }}>
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                disabled={busy}
                title={m.hint}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: `1px solid ${model === m.id ? "var(--accent)" : "var(--border)"}`,
                  background: model === m.id ? "var(--accent)20" : "var(--surface)",
                  color: model === m.id ? "var(--accent)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: busy ? "not-allowed" : "pointer",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Idioma</div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={busy}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: 11, color: modelReady ? "#22c55e" : "var(--text-subtle)", display: "flex", alignItems: "center", gap: 4, paddingBottom: 3 }}>
          {modelReady ? "● modelo pronto" : "○ preparando modelo em segundo plano..."}
        </div>
      </div>

      {/* Área de gravação / upload */}
      {mode === "record" ? (
        <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: "32px 24px", textAlign: "center", background: "var(--surface)", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{recording ? "🔴" : "🎙️"}</div>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
            {recording ? `Gravando... ${fmtDuration(elapsed)}` : audioBlob ? "Gravação pronta" : "Clique para começar a gravar"}
          </div>
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={busy}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: recording ? "#ef4444" : "var(--accent)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: busy ? "not-allowed" : "pointer",
            }}
          >
            {recording ? "⏹ Parar e transcrever" : audioBlob ? "🔁 Gravar de novo" : "● Gravar"}
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 16,
            padding: "40px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? "var(--accent)0a" : "var(--surface)",
            marginBottom: 24,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.flac,.aac"
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <div style={{ fontSize: 32, marginBottom: 10 }}>📁</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>
            {fileName ?? "Arraste um áudio, ou clique para selecionar"}
          </div>
        </div>
      )}

      {busy && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>
            {showModelLoading
              ? `Carregando modelo de transcrição... ${modelProgress}% — na primeira vez isso baixa o modelo (pode levar um pouco); depois fica em cache e é instantâneo.`
              : "Transcrevendo áudio..."}
          </div>
          <div style={{ height: 6, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: showModelLoading ? `${modelProgress}%` : "100%",
              background: "var(--accent)",
              transition: "width 0.2s",
              ...(!showModelLoading ? { animation: "pulse 1.4s ease-in-out infinite" } : {}),
            }} />
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: "#ef444420", border: "1px solid #ef444440", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span>{error}</span>
          {audioBlob && (
            <button
              onClick={retry}
              style={{ background: "#ef4444", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              🔁 Tentar de novo
            </button>
          )}
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              onClick={copy}
              style={{ background: copied ? "#10b981" : "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 500, color: copied ? "#fff" : "var(--text-muted)", cursor: "pointer", transition: "all 0.2s" }}
            >
              {copied ? "✓ Copiado!" : "Copiar texto"}
            </button>
            <button
              onClick={downloadTxt}
              style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}
            >
              ↓ Baixar .txt
            </button>
          </div>
          <textarea
            readOnly
            value={result}
            style={{
              width: "100%",
              height: 320,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 16,
              color: "var(--text)",
              fontSize: 14,
              lineHeight: 1.8,
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>
      )}
    </div>
  );
}
