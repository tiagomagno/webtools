"use client";

import { useState, useEffect } from "react";

function pad(n: number) { return String(n).padStart(2, "0"); }

function toLocalInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function Row({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <div onClick={copy} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13.5, fontFamily: "monospace", color: "var(--text)", textAlign: "right", wordBreak: "break-all" }}>
        {value} <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{copied ? "✓" : "⧉"}</span>
      </span>
    </div>
  );
}

export default function TimestampTool() {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<"s" | "ms">("s");
  const [dateInput, setDateInput] = useState(() => toLocalInput(new Date()));

  // Relógio do timestamp atual.
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const tsNum = Number(tsInput);
  const tsValid = tsInput.trim() !== "" && Number.isFinite(tsNum);
  const tsDate = tsValid ? new Date(unit === "s" ? tsNum * 1000 : tsNum) : null;
  const tsDateValid = tsDate && !isNaN(tsDate.getTime());

  const parsedDate = dateInput ? new Date(dateInput) : null;
  const dateValid = parsedDate && !isNaN(parsedDate.getTime());

  const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" };
  const cardStyle: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Agora */}
      <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Timestamp atual (Unix, segundos)</span>
        <span onClick={() => { setTsInput(String(now)); setUnit("s"); }} style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: "var(--text)", cursor: "pointer" }}>{now}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Timestamp → Data */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>Timestamp → Data</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input value={tsInput} onChange={(e) => setTsInput(e.target.value)} placeholder="1750000000" style={inputStyle} />
            <select value={unit} onChange={(e) => setUnit(e.target.value as "s" | "ms")} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", color: "var(--text)", fontSize: 13 }}>
              <option value="s">s</option>
              <option value="ms">ms</option>
            </select>
          </div>
          {tsDateValid ? (
            <div style={cardStyle}>
              <Row label="Local" value={tsDate!.toLocaleString("pt-BR")} />
              <Row label="UTC" value={tsDate!.toUTCString()} />
              <Row label="ISO 8601" value={tsDate!.toISOString()} />
              <Row label="Relativo" value={relative(tsDate!)} />
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#ef4444", padding: "8px 2px" }}>{tsInput.trim() ? "Timestamp inválido." : "Informe um timestamp."}</div>
          )}
        </div>

        {/* Data → Timestamp */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>Data → Timestamp</div>
          <input type="datetime-local" step={1} value={dateInput} onChange={(e) => setDateInput(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }} />
          {dateValid ? (
            <div style={cardStyle}>
              <Row label="Unix (s)" value={String(Math.floor(parsedDate!.getTime() / 1000))} />
              <Row label="Unix (ms)" value={String(parsedDate!.getTime())} />
              <Row label="ISO 8601" value={parsedDate!.toISOString()} />
              <Row label="UTC" value={parsedDate!.toUTCString()} />
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#ef4444", padding: "8px 2px" }}>Data inválida.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function relative(date: Date): string {
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const sec = Math.round(abs / 1000);
  const min = Math.round(sec / 60);
  const hour = Math.round(min / 60);
  const day = Math.round(hour / 24);
  const future = diff > 0;
  let str: string;
  if (sec < 60) str = `${sec} s`;
  else if (min < 60) str = `${min} min`;
  else if (hour < 24) str = `${hour} h`;
  else if (day < 365) str = `${day} dia${day > 1 ? "s" : ""}`;
  else str = `${Math.round(day / 365)} ano(s)`;
  return future ? `em ${str}` : `há ${str}`;
}
