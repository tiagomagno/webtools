"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useToolHistory } from "../lib/useToolHistory";
import { loginHref } from "../lib/auth/next";

interface Props<T> {
  slug: string;
  /** Monta o que será guardado no momento do clique. */
  getPayload: () => T;
  disabled?: boolean;
}

const buttonStyle: React.CSSProperties = {
  background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8,
  padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer",
};

/** Botão "Salvar no histórico" para quem tem conta; convite para entrar para quem não tem. */
export default function SaveToHistory<T>({ slug, getPayload, disabled }: Props<T>) {
  const pathname = usePathname();
  const { canSave, loading, save } = useToolHistory<T>(slug, { autoLoad: false });
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  if (loading) return null;

  if (!canSave) {
    return (
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
        <Link href={loginHref(pathname)} style={{ color: "var(--accent)", fontWeight: 600 }}>Entre</Link> para guardar seu histórico.
      </p>
    );
  }

  const handleClick = async () => {
    setState("saving");
    try {
      setState((await save(getPayload())) ? "saved" : "error");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button type="button" onClick={handleClick} disabled={disabled || state === "saving"} style={{ ...buttonStyle, opacity: disabled ? 0.6 : 1 }}>
      {state === "saving" ? "Salvando…" : state === "saved" ? "✓ Salvo no histórico" : state === "error" ? "Erro ao salvar" : "Salvar no histórico"}
    </button>
  );
}
