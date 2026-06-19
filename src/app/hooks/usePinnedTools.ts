"use client";

import { useState, useEffect } from "react";

const DEFAULT_PINS = ["color-palette", "gradients", "text-cleaner", "pdf-extractor"];
const STORAGE_KEY = "webtools:pinned";
const MAX_PINS = 4;

export function usePinnedTools() {
  const [pinned, setPinned] = useState<string[]>(DEFAULT_PINS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPinned(JSON.parse(stored));
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
