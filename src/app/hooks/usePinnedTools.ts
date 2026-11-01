"use client";

import { useState, useEffect } from "react";
import { TOOLS } from "../lib/tools";

const DEFAULT_PINS = ["color-palette", "gradients", "editor-texto", "ferramentas-pdf"];
const STORAGE_KEY = "webtools:pinned";
const MAX_PINS = 4;

// Favoritos salvos podem apontar para ferramentas que foram unificadas ou removidas.
const isKnownTool = (slug: unknown): slug is string => typeof slug === "string" && TOOLS.some((t) => t.slug === slug);

export function usePinnedTools() {
  const [pinned, setPinned] = useState<string[]>(DEFAULT_PINS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setPinned(parsed.filter(isKnownTool).slice(0, MAX_PINS));
      }
    } catch {}
  }, []);

  const save = (next: string[]) => {
    setPinned(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const toggle = (slug: string) => {
    save(
      pinned.includes(slug)
        ? pinned.filter((s) => s !== slug)
        : pinned.length < MAX_PINS
        ? [...pinned, slug]
        : pinned
    );
  };

  return { pinned, toggle, mounted, MAX_PINS };
}
