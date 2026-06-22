"use client";

import { useState, useMemo } from "react";
import { num } from "../../lib/format";

type Mode = "diff" | "add";

const DAY = 1000 * 60 * 60 * 24;

function fullDiff(a: Date, b: Date) {
  const [from, to] = a <= b ? [a, b] : [b, a];
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) { months--; days += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  return { years, months, days };
}

export default function DateCalculator() {
  const [mode, setMode] = useState<Mode>("diff");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [amount, setAmount] = useState("30");
  const [direction, setDirection] = useState<1 | -1>(1);

  const diffResult = useMemo(() => {
    if (mode !== "diff" || !start || !end) return null;
    const a = new Date(start + "T00:00:00");
    const b = new Date(end + "T00:00:00");
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    const totalDays = Math.round(Math.abs(b.getTime() - a.getTime()) / DAY);
    return { ...fullDiff(a, b), totalDays, weeks: Math.floor(totalDays / 7), restDays: totalDays % 7 };
  }, [mode, start, end]);

  const addResult = useMemo(() => {
    if (mode !== "add" || !start) return null;
    const a = new Date(start + "T00:00:00");
    const days = parseInt(amount, 10);
    if (isNaN(a.getTime()) || isNaN(days)) return null;
    const r = new Date(a.getTime() + direction * days * DAY);
    return r;
  }, [mode, start, amount, direction]);

  const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 14 };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setMode("diff")} style={seg(mode === "diff")}>Diferença entre datas</button>
        <button onClick={() => setMode("add")} style={seg(mode === "add")}>Somar / subtrair dias</button>
      </div>

      {mode === "diff" ? (
        <>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>DATA INICIAL</label>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>DATA FINAL</label>
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={inputStyle} />
            </div>
          </div>
          {diffResult ? (
            <>
              <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 22, textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Diferença</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)" }}>{diffResult.years}a {diffResult.months}m {diffResult.days}d</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{num(diffResult.totalDays, 0)}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>dias no total</div>
                </div>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{num(diffResult.weeks, 0)} sem. {diffResult.restDays}d</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>em semanas</div>
                </div>
              </div>
            </>
          ) : (
            <p style={{ fontSize: 14, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Informe as duas datas.</p>
          )}
        </>
      ) : (
        <>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 20 }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>DATA BASE</label>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setDirection(1)} style={seg(direction === 1)}>+ Somar</button>
              <button onClick={() => setDirection(-1)} style={seg(direction === -1)}>− Subtrair</button>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>DIAS</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ ...inputStyle, width: 100, fontFamily: "monospace" }} />
            </div>
          </div>
          {addResult ? (
            <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 22, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Data resultante</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)" }}>{addResult.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</div>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Informe a data base e a quantidade de dias.</p>
          )}
        </>
      )}
    </div>
  );
}

function seg(active: boolean): React.CSSProperties {
  return { padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: active ? "var(--accent)" : "var(--border)", background: active ? "var(--accent)" : "var(--surface-2)", color: active ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" };
}
