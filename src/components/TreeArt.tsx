// The pine tree itself: 4 snowy tiers, a star, a string of lights.
// viewBox is 360x480; ornament spots (SLOTS) are in the same units.

const TIERS = [
  { top: 50, base: 150, hw: 62 },
  { top: 100, base: 228, hw: 96 },
  { top: 165, base: 310, hw: 132 },
  { top: 215, base: 418, hw: 170 },
];

// spots for one page of ornaments, top to bottom (2 + 3 + 4 + 5 + 6 = 20)
export const SLOTS: [number, number][] = [
  [160, 122], [200, 122],
  [138, 196], [180, 192], [222, 196],
  [112, 268], [157, 262], [203, 262], [248, 268],
  [90, 334], [135, 328], [180, 326], [225, 328], [270, 334],
  [58, 398], [106, 392], [155, 390], [205, 390], [254, 392], [302, 398],
];

// a tier is a triangle with a wavy bottom edge (the branches)
function tierPath(cx: number, top: number, base: number, hw: number) {
  const waves = Math.round(hw / 22);
  const w = (hw * 2) / waves;
  let d = `M${cx} ${top} L${cx + hw} ${base}`;
  for (let i = 0; i < waves; i++) {
    const x1 = cx + hw - w * i;
    d += ` Q${x1 - w / 2} ${base + 12} ${x1 - w} ${base}`;
  }
  return d + " Z";
}

// snow resting on the upper edges of a tier
function snowPath(cx: number, top: number, base: number, hw: number) {
  const y = top + (base - top) * 0.42;
  const x = hw * 0.42;
  return `M${cx} ${top + 2} L${cx + x} ${y} Q${cx + x * 0.6} ${y + 9} ${cx + x * 0.25} ${y + 2} Q${cx} ${y + 12} ${cx - x * 0.25} ${y + 2} Q${cx - x * 0.6} ${y + 9} ${cx - x} ${y} Z`;
}

const LIGHTS = [
  // [x1, y1, x2, y2, sag] garland strands across the tree
  [128, 140, 232, 150, 18],
  [98, 218, 262, 230, 26],
  [62, 300, 298, 312, 32],
  [30, 370, 330, 382, 36],
];
const BULB_COLORS = ["#ffd27a", "#ff7a6b", "#8fd3ff", "#b5f58a", "#ffb3e6"];

export default function TreeArt() {
  return (
    <svg viewBox="0 0 360 480" className="block size-full" aria-hidden="true">
      <defs>
        <linearGradient id="pine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f8a5f" />
          <stop offset="1" stopColor="#1f5139" />
        </linearGradient>
        <radialGradient id="star-glow">
          <stop offset="0" stopColor="#fff3d6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground snow + trunk */}
      <ellipse cx="180" cy="452" rx="175" ry="22" fill="#e8eef5" opacity="0.9" />
      <rect x="160" y="405" width="40" height="48" rx="4" fill="#6b4226" />
      <rect x="160" y="405" width="12" height="48" fill="#83532f" />

      {TIERS.map((t, i) => (
        <g key={i}>
          <path d={tierPath(180, t.top, t.base, t.hw)} fill="url(#pine)" stroke="#173d2b" strokeWidth="2" strokeLinejoin="round" />
          <path d={snowPath(180, t.top, t.base, t.hw)} fill="#f4f8fb" opacity="0.92" />
        </g>
      ))}

      {/* garland lights */}
      {LIGHTS.map(([x1, y1, x2, y2, sag], i) => {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 + sag;
        return (
          <g key={i}>
            <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" stroke="#2b2418" strokeWidth="1.4" opacity="0.8" />
            {Array.from({ length: 7 }, (_, k) => {
              const t = (k + 0.5) / 7;
              const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
              const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2 + 4;
              const c = BULB_COLORS[(i * 7 + k) % BULB_COLORS.length];
              return (
                <circle
                  key={k}
                  cx={x}
                  cy={y}
                  r="3.6"
                  fill={c}
                  className="animate-twinkle"
                  style={{ animationDelay: `${((i * 7 + k) % 5) * 0.37}s`, filter: `drop-shadow(0 0 4px ${c})` }}
                />
              );
            })}
          </g>
        );
      })}

      {/* star */}
      <circle cx="180" cy="44" r="34" fill="url(#star-glow)" className="animate-twinkle" />
      <path
        d="M180 20 L187 37 L205 38 L191 49 L196 67 L180 57 L164 67 L169 49 L155 38 L173 37 Z"
        fill="#ffd27a"
        stroke="#d99b1a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
