"use client";

import { useSyncExternalStore } from "react";
import { TOOLS } from "../lib/tools";

const DEFAULT_PINS = ["color-palette", "gradients", "editor-texto", "ferramentas-pdf"];
const STORAGE_KEY = "webtools:pinned";
const MAX_PINS = 4;

// Favoritos salvos podem apontar para ferramentas que foram unificadas ou removidas.
const isKnownTool = (slug: unknown): slug is string => typeof slug === "string" && TOOLS.some((t) => t.slug === slug);

// Armazenamento compartilhado: o menu inferior, a janela de favoritos e o menu do usuário
// leem a mesma lista, então mudar em um lugar atualiza todos (e as outras abas do navegador).
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  let pins = DEFAULT_PINS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) pins = parsed.filter(isKnownTool).slice(0, MAX_PINS);
    }
  } catch {}
  cache = pins;
  return pins;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function save(next: string[]) {
  cache = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

export function usePinnedTools() {
  const pinned = useSyncExternalStore(subscribe, read, () => DEFAULT_PINS);
  // Só true no navegador: evita desenhar favoritos do servidor antes de ler os salvos.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const toggle = (slug: string) => {
    const current = read();
    save(
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : current.length < MAX_PINS
        ? [...current, slug]
        : current
    );
  };

  return { pinned, toggle, mounted, MAX_PINS };
}
