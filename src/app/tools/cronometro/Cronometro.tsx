'use client';
import { useState, useEffect, useRef } from 'react';

function fmt(ms: number) {
  const total = Math.floor(ms / 10);
  const cs = total % 100;
  const s = Math.floor(total / 100) % 60;
  const m = Math.floor(total / 6000) % 60;
  const h = Math.floor(total / 360000);
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
}

function fmtTimer(ms: number) {
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m % 60).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}

type Tab = 'stopwatch' | 'timer';

export default function Cronometro() {
  const [tab, setTab] = useState<Tab>('stopwatch');

  // Stopwatch
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const baseRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now();
      const tick = () => {
        setElapsed(baseRef.current + (performance.now() - startRef.current));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
      baseRef.current = elapsed;
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  function reset() { setRunning(false); setElapsed(0); baseRef.current = 0; setLaps([]); }
  function lap() { setLaps(p => [...p, elapsed]); }

  // Timer
  const [timerH, setTimerH] = useState(0);
  const [timerM, setTimerM] = useState(5);
  const [timerS, setTimerS] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLeft, setTimerLeft] = useState<number | null>(null);
  const timerStartRef = useRef<number>(0);
  const timerBaseRef = useRef<number>(0);
  const timerRafRef = useRef<number>(0);

  const timerTotal = (timerH * 3600 + timerM * 60 + timerS) * 1000;

  useEffect(() => {
    if (timerRunning && timerLeft !== null) {
      timerStartRef.current = performance.now();
      const tick = () => {
        const remaining = timerBaseRef.current - (performance.now() - timerStartRef.current);
        if (remaining <= 0) { setTimerLeft(0); setTimerRunning(false); return; }
        setTimerLeft(remaining);
        timerRafRef.current = requestAnimationFrame(tick);
      };
      timerRafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(timerRafRef.current);
      if (timerLeft !== null) timerBaseRef.current = timerLeft;
    }
    return () => cancelAnimationFrame(timerRafRef.current);
  }, [timerRunning]);

  function startTimer() {
    const total = timerTotal;
    if (!total) return;
    timerBaseRef.current = timerLeft ?? total;
    setTimerLeft(timerBaseRef.current);
    setTimerRunning(true);
  }

  function resetTimer() { setTimerRunning(false); setTimerLeft(null); timerBaseRef.current = 0; }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.5rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer',
    background: active ? 'var(--accent)' : 'var(--surface)',
    color: active ? '#fff' : 'var(--text)',
    border: '1px solid var(--border)', fontWeight: active ? 700 : 400,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button style={btnStyle(tab === 'stopwatch')} onClick={() => { setTab('stopwatch'); reset(); resetTimer(); }}>Cronômetro</button>
        <button style={btnStyle(tab === 'timer')} onClick={() => { setTab('timer'); reset(); resetTimer(); }}>Timer</button>
      </div>

      {tab === 'stopwatch' ? (
        <>
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 'clamp(2.5rem,8vw,4rem)', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.05em' }}>
            {fmt(elapsed)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setRunning(r => !r)}
              style={{ ...btnStyle(running), background: running ? '#ef4444' : '#22c55e', color: '#fff' }}
            >
              {running ? 'Pausar' : elapsed > 0 ? 'Continuar' : 'Iniciar'}
            </button>
            {running && <button style={btnStyle(false)} onClick={lap}>Volta</button>}
            {!running && elapsed > 0 && <button style={btnStyle(false)} onClick={reset}>Resetar</button>}
          </div>
          {laps.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {laps.map((l, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.4rem 0.75rem', borderRadius: '0.4rem',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Volta {i + 1}</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{fmt(l)}</span>
                  {i > 0 && <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.85rem' }}>+{fmt(l - laps[i-1])}</span>}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {timerLeft === null && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
              {[['h', timerH, setTimerH, 23], ['m', timerM, setTimerM, 59], ['s', timerS, setTimerS, 59]].map(([label, val, setter, max]) => (
                <div key={label as string} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input
                    type="number" value={val as number} min={0} max={max as number}
                    onChange={e => (setter as (v: number) => void)(Math.min(max as number, Math.max(0, Number(e.target.value))))}
                    style={{
                      width: '4rem', padding: '0.5rem', textAlign: 'center',
                      fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700,
                      border: '1px solid var(--border)', borderRadius: '0.5rem',
                      background: 'var(--surface)', color: 'var(--text)',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label as string}</span>
                </div>
              ))}
            </div>
          )}

          {timerLeft !== null && (
            <div style={{
              textAlign: 'center', fontFamily: 'monospace', fontSize: 'clamp(2.5rem,8vw,4rem)',
              fontWeight: 700, color: timerLeft <= 10000 ? '#ef4444' : 'var(--accent)',
              letterSpacing: '0.05em',
            }}>
              {fmtTimer(timerLeft)}
            </div>
          )}

          {timerLeft === 0 && (
            <p style={{ textAlign: 'center', fontWeight: 700, color: '#ef4444', fontSize: '1.2rem' }}>⏰ Tempo esgotado!</p>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {timerLeft === null || timerLeft === 0 ? (
              <button style={{ ...btnStyle(false), background: '#22c55e', color: '#fff' }} onClick={startTimer}>Iniciar</button>
            ) : timerRunning ? (
              <button style={{ ...btnStyle(false), background: '#ef4444', color: '#fff' }} onClick={() => setTimerRunning(false)}>Pausar</button>
            ) : (
              <button style={{ ...btnStyle(false), background: '#22c55e', color: '#fff' }} onClick={() => { timerBaseRef.current = timerLeft!; setTimerRunning(true); }}>Continuar</button>
            )}
            {timerLeft !== null && <button style={btnStyle(false)} onClick={resetTimer}>Resetar</button>}
          </div>
        </>
      )}
    </div>
  );
}
