// Tabelas de conversão de unidades físicas para #65.

export type UnitCategory = 'comprimento' | 'peso' | 'volume' | 'area' | 'velocidade' | 'temperatura';

export interface Unit { label: string; toBase: number; fromBase?: (v: number) => number; toBaseF?: (v: number) => number; }

export const UNITS: Record<UnitCategory, Record<string, Unit>> = {
  comprimento: {
    mm:  { label: 'Milímetro (mm)',   toBase: 0.001 },
    cm:  { label: 'Centímetro (cm)',  toBase: 0.01 },
    m:   { label: 'Metro (m)',        toBase: 1 },
    km:  { label: 'Quilômetro (km)', toBase: 1000 },
    in:  { label: 'Polegada (in)',    toBase: 0.0254 },
    ft:  { label: 'Pé (ft)',          toBase: 0.3048 },
    yd:  { label: 'Jarda (yd)',       toBase: 0.9144 },
    mi:  { label: 'Milha (mi)',       toBase: 1609.344 },
  },
  peso: {
    mg:  { label: 'Miligrama (mg)',   toBase: 0.000001 },
    g:   { label: 'Grama (g)',        toBase: 0.001 },
    kg:  { label: 'Quilograma (kg)',  toBase: 1 },
    t:   { label: 'Tonelada (t)',     toBase: 1000 },
    lb:  { label: 'Libra (lb)',       toBase: 0.45359237 },
    oz:  { label: 'Onça (oz)',        toBase: 0.028349523 },
  },
  volume: {
    ml:  { label: 'Mililitro (ml)',   toBase: 0.001 },
    l:   { label: 'Litro (l)',        toBase: 1 },
    m3:  { label: 'Metro³ (m³)',      toBase: 1000 },
    gal: { label: 'Galão US (gal)',   toBase: 3.785411784 },
    qt:  { label: 'Quarto (qt)',      toBase: 0.946352946 },
    floz:{ label: 'Fl oz (fl oz)',    toBase: 0.029573529 },
  },
  area: {
    mm2: { label: 'Milímetro² (mm²)', toBase: 0.000001 },
    cm2: { label: 'Centímetro² (cm²)',toBase: 0.0001 },
    m2:  { label: 'Metro² (m²)',      toBase: 1 },
    km2: { label: 'Quilômetro² (km²)',toBase: 1_000_000 },
    ha:  { label: 'Hectare (ha)',     toBase: 10_000 },
    ac:  { label: 'Acre (ac)',        toBase: 4046.856422 },
    ft2: { label: 'Pé² (ft²)',        toBase: 0.09290304 },
  },
  velocidade: {
    mps: { label: 'Metro/s (m/s)',    toBase: 1 },
    kph: { label: 'Km/h (km/h)',      toBase: 1/3.6 },
    mph: { label: 'Milha/h (mph)',    toBase: 0.44704 },
    kt:  { label: 'Nó (kt)',          toBase: 0.514444 },
    fps: { label: 'Pé/s (ft/s)',      toBase: 0.3048 },
  },
  temperatura: {
    C: { label: 'Celsius (°C)',    toBase: 1, toBaseF: (v) => v },
    F: { label: 'Fahrenheit (°F)', toBase: 1, toBaseF: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    K: { label: 'Kelvin (K)',      toBase: 1, toBaseF: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
};

export function convert(value: number, from: string, to: string, category: UnitCategory): number {
  const cat = UNITS[category];
  const fromUnit = cat[from];
  const toUnit = cat[to];
  if (!fromUnit || !toUnit) return NaN;

  if (category === 'temperatura') {
    const inC = fromUnit.toBaseF ? fromUnit.toBaseF(value) : value;
    return toUnit.fromBase ? toUnit.fromBase(inC) : inC;
  }

  const inBase = value * fromUnit.toBase;
  return inBase / toUnit.toBase;
}
