"use client";

import { useState, useMemo } from "react";
import { num } from "../../lib/format";

function diff(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months--;
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }
  return { years, months, days };
}

function nextBirthday(birth: Date, today: Date) {
  let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  const ms = next.getTime() - today.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function AgeCalculator() {
  const [birth, setBirth] = useState("");
  const [ref, setRef] = useState("");

  const result = useMemo(() => {
    if (!birth) return null;
    const b = new Date(birth + "T00:00:00");
    const t = ref ? new Date(ref + "T00:00:00") : new Date();
    if (isNaN(b.getTime()) || b > t) return null;
    const d = diff(b, t);
    const totalDays = Math.floor((t.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
    return {
      ...d,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      totalMonths: d.years * 12 + d.months,
      totalHours: totalDays * 24,
      nextBday: nextBirthday(b, t),
    };
  }, [birth, ref]);

  const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 14 };

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>DATA DE NASCIMENTO</label>
          <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>CALCULAR ATÉ (opcional)</label>
          <input type="date" value={ref} onChange={(e) => setRef(e.target.value)} style={inputStyle} />
        </div>
      </div>

      {result ? (
        <>
          <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 22, textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Idade</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
              {result.years} anos, {result.months} meses e {result.days} dias
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>🎂 Próximo aniversário em {result.nextBday} dia{result.nextBday !== 1 ? "s" : ""}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
            {[
              ["Meses", result.totalMonths],
              ["Semanas", result.totalWeeks],
              ["Dias", result.totalDays],
              ["Horas", result.totalHours],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{num(value as number, 0)}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ fontSize: 14, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>
          {birth ? "Verifique a data informada." : "Informe a data de nascimento para calcular."}
        </p>
      )}
    </div>
  );
}
