'use client';
import { useState, useRef } from 'react';

type Mode = 'toBase64' | 'fromBase64';

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageToBase64() {
  const [mode, setMode] = useState<Mode>('toBase64');
  const [b64, setB64] = useState('');
  const [preview, setPreview] = useState('');
  const [info, setInfo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setB64(result);
      setPreview(result);
      setInfo(`${file.name} — ${fmtBytes(file.size)} → ${fmtBytes(result.length)} base64`);
    };
    reader.readAsDataURL(file);
  }

  function handleB64Change(val: string) {
    setB64(val);
    const trimmed = val.trim();
    if (trimmed.startsWith('data:image/')) {
      setPreview(trimmed);
    } else if (/^[A-Za-z0-9+/=]+$/.test(trimmed)) {
      setPreview(`data:image/png;base64,${trimmed}`);
    } else {
      setPreview('');
    }
  }

  function download() {
    const a = document.createElement('a');
    a.href = preview;
    a.download = 'imagem';
    a.click();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['toBase64', 'fromBase64'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setB64(''); setPreview(''); setInfo(''); }}
            style={{
              padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
              background: mode === m ? 'var(--accent)' : 'var(--surface)',
              color: mode === m ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)', fontWeight: mode === m ? 700 : 400,
            }}
          >
            {m === 'toBase64' ? 'Imagem → Base64' : 'Base64 → Imagem'}
          </button>
        ))}
      </div>

      {mode === 'toBase64' ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
          style={{
            border: '2px dashed var(--border)', borderRadius: '0.75rem',
            padding: '2rem', textAlign: 'center', cursor: 'pointer',
            background: 'var(--surface)', color: 'var(--text-muted)',
          }}
        >
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          🖼️ Arraste uma imagem ou clique para selecionar
        </div>
      ) : (
        <textarea
          value={b64}
          onChange={e => handleB64Change(e.target.value)}
          placeholder="Cole o código Base64 ou data URI aqui (data:image/png;base64,…)"
          rows={5}
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
            border: '1px solid var(--border)', background: 'var(--surface)',
            color: 'var(--text)', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem',
          }}
        />
      )}

      {info && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{info}</p>}

      {preview && mode === 'toBase64' && (
        <>
          <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '0.5rem', objectFit: 'contain' }} />
          <div style={{ position: 'relative' }}>
            <textarea
              readOnly value={b64} rows={4}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--accent)', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.75rem',
              }}
            />
            <button
              onClick={() => navigator.clipboard.writeText(b64)}
              style={{
                position: 'absolute', top: '0.5rem', right: '0.5rem',
                padding: '0.25rem 0.75rem', borderRadius: '0.4rem',
                background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              }}
            >
              Copiar
            </button>
          </div>
        </>
      )}

      {preview && mode === 'fromBase64' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
          <img src={preview} alt="decoded" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.5rem', objectFit: 'contain' }} onError={() => setPreview('')} />
          <button
            onClick={download}
            style={{
              padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
              background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700,
            }}
          >
            ⬇️ Baixar Imagem
          </button>
        </div>
      )}
    </div>
  );
}
