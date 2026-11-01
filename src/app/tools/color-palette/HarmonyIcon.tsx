import { HARMONIES, type HarmonyType } from "../../lib/palette";

const SIZE = 40;
const C = SIZE / 2;
const R = 12;
// Arredonda para o servidor e o navegador gerarem exatamente o mesmo SVG (evita erro de hidratação).
const round = (n: number) => Math.round(n * 100) / 100;

/** Ícone de uma harmonia: círculo da roda com um ponto em cada matiz usado, ligados por linhas. */
export default function HarmonyIcon({ type }: { type: HarmonyType }) {
  const anchors = HARMONIES.find((h) => h.id === type)?.anchors ?? [0];
  // Monocromática: pontos empilhados no centro (mesmo matiz, luminosidades diferentes).
  const points = type === "monochromatic"
    ? [[C, C - 8], [C, C], [C, C + 8]]
    : anchors.map((deg) => [round(C + R * Math.sin((deg * Math.PI) / 180)), round(C - R * Math.cos((deg * Math.PI) / 180))]);
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ") + (points.length > 2 && type !== "monochromatic" ? " Z" : "");

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" aria-hidden="true">
      <circle cx={C} cy={C} r={R + 4} stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d={path} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="currentColor" />
      ))}
    </svg>
  );
}
