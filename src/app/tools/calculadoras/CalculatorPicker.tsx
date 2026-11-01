"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calculator as CalculatorIcon, CaretDown, Check } from "@phosphor-icons/react";
import { ALL, GROUPS } from "./catalogo";

/** Seletor de tipo de calculadora, no canto direito do título. O tipo escolhido vai em `?tipo=` (lido também pelo corpo da página). */
function PickerInner() {
  const router = useRouter();
  const active = useSearchParams().get("tipo");
  const [open, setOpen] = useState(false);
  const current = ALL.find((c) => c.key === active);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function select(key: string) {
    setOpen(false);
    router.replace(`/tools/calculadoras?tipo=${key}`, { scroll: false });
  }

  const CurrentIcon = current?.icon ?? CalculatorIcon;

  return (
    <div style={{ position: "relative" }}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 44, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: current ? "var(--text)" : "var(--text-muted)" }}>
        <CurrentIcon size={18} /> {current ? current.label : "Selecione o tipo de calculadora"} <CaretDown size={14} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div role="menu" aria-label="Escolher calculadora" style={{ position: "absolute", zIndex: 41, top: "calc(100% + 8px)", right: 0, width: 280, maxWidth: "calc(100vw - 48px)", maxHeight: "60vh", overflowY: "auto", padding: 6, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
            {GROUPS.map((g) => (
              <div key={g.title} role="group" aria-label={g.title}>
                <div style={{ padding: "10px 10px 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)" }}>{g.title}</div>
                {g.items.map(({ key, label, icon: ItemIcon }) => (
                  <button key={key} role="menuitemradio" aria-checked={key === active} type="button" onClick={() => select(key)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, minHeight: 36, padding: "6px 10px", fontSize: 13, fontWeight: 600, textAlign: "left", background: key === active ? "var(--surface-2)" : "none", border: "none", borderRadius: 6, cursor: "pointer", color: "var(--text)" }}>
                    <ItemIcon size={16} /> {label}
                    {key === active && <Check size={14} weight="bold" style={{ marginLeft: "auto" }} />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CalculatorPicker() {
  return (
    <Suspense fallback={null}>
      <PickerInner />
    </Suspense>
  );
}
