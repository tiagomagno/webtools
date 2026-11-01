"use client";

import { useEffect, useState } from "react";
import { Trash } from "@phosphor-icons/react";
import { isValidHex, type HarmonyType } from "../../lib/palette";

// Mesma chave e formato da biblioteca anterior: as paletas já salvas continuam aparecendo.
// `harmony` guarda as cores da paleta; `primary` e `secondary` ficam por compatibilidade.
const STORAGE_KEY = "cp-library-v2";

interface SavedPalette {
  id: string;
  name: string;
  base: string;
  primary: string;
  secondary: string;
  harmony: string[];
  harmonyType: HarmonyType;
  savedAt: number;
}

export interface LibraryLoad {
  colors: string[];
  base: string;
  harmonyType: HarmonyType;
}

interface LibraryPanelProps {
  colors: string[];
  base: string;
  harmonyType: HarmonyType;
  onLoad: (item: LibraryLoad) => void;
}

/** Biblioteca pessoal, guardada neste navegador (não precisa de conta). */
export default function LibraryPanel({ colors, base, harmonyType, onLoad }: LibraryPanelProps) {
  const [saved, setSaved] = useState<SavedPalette[]>([]);
  const [name, setName] = useState("");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw) as SavedPalette[]);
    } catch { /* biblioteca ilegível: começa vazia */ }
  }, []);

  const persist = (list: SavedPalette[]) => {
    setSaved(list);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* armazenamento indisponível */ }
  };

  const save = () => {
    persist([{
      id: Date.now().toString(),
      name: name.trim() || `Paleta ${new Date().toLocaleDateString("pt-BR")}`,
      base, primary: base, secondary: base, harmony: colors, harmonyType, savedAt: Date.now(),
    }, ...saved]);
    setName("");
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
  };

  const valid = (list: string[]) => list.filter(isValidHex);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <form onSubmit={(e) => { e.preventDefault(); save(); }} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div aria-hidden="true" style={{ display: "flex", flexShrink: 0 }}>
          {colors.map((c, i) => <span key={i} style={{ width: 16, height: 32, background: c }} />)}
        </div>
        <input
          value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da paleta" aria-label="Nome da paleta"
          style={{ flex: 1, minWidth: 0, minHeight: 36, background: "var(--surface-2)", border: "1px solid var(--border)", padding: "6px 10px", color: "var(--text)", fontSize: 13 }}
        />
        <button type="submit"
          style={{ minHeight: 36, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: flash ? "#16a34a" : "var(--accent-strong)", color: "#fff" }}>
          {flash ? "Salva" : "Salvar"}
        </button>
      </form>

      {saved.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: 16 }}>Nenhuma paleta salva ainda.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {saved.map((p) => (
            <li key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border)", padding: "8px 10px", background: "var(--surface-2)" }}>
              <div aria-hidden="true" style={{ display: "flex", flexShrink: 0 }}>
                {valid(p.harmony).slice(0, 5).map((c, i) => <span key={i} style={{ width: 14, height: 28, background: c }} />)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{new Date(p.savedAt).toLocaleDateString("pt-BR")}</div>
              </div>
              <button type="button" onClick={() => onLoad({ colors: valid(p.harmony), base: p.base, harmonyType: p.harmonyType })}
                style={{ minHeight: 32, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}>
                Abrir
              </button>
              <button type="button" onClick={() => persist(saved.filter((x) => x.id !== p.id))} aria-label={`Apagar ${p.name}`}
                style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid var(--border)", background: "var(--surface)", color: "#ef4444" }}>
                <Trash size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
