"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import jsQR from "jsqr";

function isUrl(s: string): boolean {
  return /^https?:\/\//i.test(s.trim());
}

export default function QrReader() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const decodeImageData = (img: HTMLImageElement | HTMLCanvasElement, w: number, h: number): string | null => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h);
    const code = jsQR(data.data, w, h);
    return code?.data ?? null;
  };

  const readFile = useCallback((file: File) => {
    setError("");
    setResult("");
    if (!file.type.startsWith("image/")) { setError("Selecione uma imagem."); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const found = decodeImageData(img, img.width, img.height);
        if (found) setResult(found);
        else setError("Nenhum QR Code encontrado na imagem.");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  const tick = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    const found = decodeImageData(video, video.videoWidth, video.videoHeight);
    if (found) {
      setResult(found);
      stopCamera();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    setError("");
    setResult("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  }, [tick]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1400); };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {!scanning && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) readFile(f); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface)", transition: "all .15s" }}
        >
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f); }} />
          <div style={{ fontSize: 34, marginBottom: 10 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>Arraste uma imagem com QR ou clique para selecionar</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>PNG, JPG, WebP · ou use a câmera abaixo</div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        {!scanning ? (
          <button onClick={startCamera} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "var(--text)", cursor: "pointer" }}>📷 Ler com a câmera</button>
        ) : (
          <button onClick={stopCamera} style={{ background: "#ef4444", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>■ Parar câmera</button>
        )}
      </div>

      <video ref={videoRef} playsInline muted style={{ width: "100%", maxHeight: 360, objectFit: "contain", borderRadius: 12, background: "#000", display: scanning ? "block" : "none" }} />

      {error && <div style={{ color: "#ef4444", fontSize: 13 }}>{error}</div>}

      {result && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Conteúdo lido</span>
            <button onClick={copy} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
          </div>
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, fontSize: 14, fontFamily: "monospace", color: "var(--text)", wordBreak: "break-all", lineHeight: 1.6 }}>{result}</div>
          {isUrl(result) && (
            <a href={result} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>Abrir link →</a>
          )}
        </div>
      )}
    </div>
  );
}
