import type { Kind } from "@/lib/ornaments";

// Classic Christmas ornaments, hand-typed as SVG. 48x48, with a little gold loop on top
// so they look like they hang from the branch.

function Loop() {
  return (
    <g>
      <path d="M24 1 v6" stroke="#d9b45a" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24" cy="3" r="2.2" fill="none" stroke="#f5d27a" strokeWidth="1.4" />
    </g>
  );
}

function Ball() {
  return (
    <g>
      <defs>
        <radialGradient id="o-ball" cx="35%" cy="32%" r="75%">
          <stop offset="0" stopColor="#ff8f86" />
          <stop offset="0.55" stopColor="#e0483c" />
          <stop offset="1" stopColor="#8f1f18" />
        </radialGradient>
      </defs>
      <rect x="19.5" y="6" width="9" height="6" rx="1.5" fill="#e3b54d" stroke="#a87d1e" strokeWidth="0.8" />
      <circle cx="24" cy="28" r="16" fill="url(#o-ball)" stroke="#7a1a14" strokeWidth="1" />
      {/* gold band with dots */}
      <path d="M8.6 26 Q24 33 39.4 26" fill="none" stroke="#f5d27a" strokeWidth="2.2" />
      <circle cx="16" cy="29.2" r="1.2" fill="#fff3d6" />
      <circle cx="24" cy="30.5" r="1.2" fill="#fff3d6" />
      <circle cx="32" cy="29.2" r="1.2" fill="#fff3d6" />
      <ellipse cx="17.5" cy="20" rx="4.5" ry="2.6" fill="#fff" opacity="0.55" transform="rotate(-35 17.5 20)" />
    </g>
  );
}

function Star() {
  return (
    <g>
      <defs>
        <linearGradient id="o-star" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0b0" />
          <stop offset="1" stopColor="#f2b234" />
        </linearGradient>
      </defs>
      <path
        d="M24 7 L29.4 19.6 L43 20.6 L32.6 29.4 L35.9 42.8 L24 35.6 L12.1 42.8 L15.4 29.4 L5 20.6 L18.6 19.6 Z"
        fill="url(#o-star)"
        stroke="#c48a14"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M24 12 L27.6 20.8 M14 22 L21 23" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

function Bell() {
  return (
    <g>
      <defs>
        <linearGradient id="o-bell" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c48a14" />
          <stop offset="0.35" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#b77c10" />
        </linearGradient>
      </defs>
      <path d="M24 8 Q35 9 35.5 22 Q36 32 42 37 L6 37 Q12 32 12.5 22 Q13 9 24 8 Z" fill="url(#o-bell)" stroke="#8a5e0a" strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="5" y="35.5" width="38" height="4" rx="2" fill="#e8b23a" stroke="#8a5e0a" strokeWidth="1" />
      <circle cx="24" cy="42.5" r="3.4" fill="#d99b1a" stroke="#8a5e0a" strokeWidth="1" />
      {/* holly bow on top */}
      <path d="M24 9 Q17 4 15 9 Q19 12 24 9 Z M24 9 Q31 4 33 9 Q29 12 24 9 Z" fill="#2f7a52" stroke="#1f5139" strokeWidth="0.8" />
      <circle cx="24" cy="9" r="2.2" fill="#e0483c" />
    </g>
  );
}

function CandyCane() {
  return (
    <g>
      {/* white cane, then red stripes drawn along the same path with dashes */}
      <path d="M18 44 V18 A8 8 0 0 1 34 18 V21" fill="none" stroke="#7a1a14" strokeWidth="8.6" strokeLinecap="round" />
      <path d="M18 44 V18 A8 8 0 0 1 34 18 V21" fill="none" stroke="#fffaf0" strokeWidth="6.6" strokeLinecap="round" />
      <path d="M18 44 V18 A8 8 0 0 1 34 18 V21" fill="none" stroke="#e0483c" strokeWidth="6.6" strokeDasharray="3.2 4" />
      <path d="M16.6 40 V19" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

function Stocking() {
  return (
    <g>
      <path d="M15 12 H31 V28 Q31 32 35 33 L39 34 Q44 36 42 41 Q40 45 34 44 L20 41 Q14 40 15 33 Z" fill="#e0483c" stroke="#7a1a14" strokeWidth="1.2" strokeLinejoin="round" />
      {/* fluffy white cuff, heel and toe */}
      <rect x="12.5" y="8" width="21" height="8" rx="4" fill="#fffaf0" stroke="#d6cbb8" strokeWidth="1" />
      <path d="M36 34.5 Q43 35.5 42 41 Q40 44.5 35 43.8 Q37 39 36 34.5 Z" fill="#fffaf0" />
      <path d="M15.2 35 Q15.5 40 20.5 41 L22 37 Q17 36 15.2 35 Z" fill="#fffaf0" />
      <path d="M17 22 h11 M17 27 h11" stroke="#2f7a52" strokeWidth="2" strokeLinecap="round" />
      <circle cx="19" cy="12" r="1" fill="#d6cbb8" />
      <circle cx="27" cy="12" r="1" fill="#d6cbb8" />
    </g>
  );
}

function Gift() {
  return (
    <g>
      <rect x="8" y="20" width="32" height="23" rx="2.5" fill="#2f7a52" stroke="#1a4430" strokeWidth="1.2" />
      <rect x="6" y="15" width="36" height="8" rx="2" fill="#3f8a5f" stroke="#1a4430" strokeWidth="1.2" />
      <rect x="21" y="15" width="6" height="28" fill="#e0483c" />
      <path d="M24 15 Q15 5 12 10 Q12 15 24 15 Z M24 15 Q33 5 36 10 Q36 15 24 15 Z" fill="#e0483c" stroke="#8f1f18" strokeWidth="1" />
      <circle cx="24" cy="15" r="2.4" fill="#ff8f86" stroke="#8f1f18" strokeWidth="0.8" />
      <path d="M11 26 v12" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity="0.35" />
    </g>
  );
}

function Snowman() {
  return (
    <g>
      <circle cx="24" cy="33" r="11" fill="#fbfdff" stroke="#b8c6d6" strokeWidth="1.1" />
      <circle cx="24" cy="18" r="8" fill="#fbfdff" stroke="#b8c6d6" strokeWidth="1.1" />
      {/* hat */}
      <rect x="17" y="10" width="14" height="2.6" rx="1.2" fill="#232d45" />
      <rect x="19.5" y="3.5" width="9" height="7.5" rx="1" fill="#232d45" />
      <rect x="19.5" y="8" width="9" height="1.8" fill="#e0483c" />
      {/* face */}
      <circle cx="21" cy="17" r="1.1" fill="#232d45" />
      <circle cx="27" cy="17" r="1.1" fill="#232d45" />
      <path d="M24 19 l5 1.4 l-5 0.8 Z" fill="#f58a1f" />
      <ellipse cx="19" cy="21" rx="1.6" ry="1" fill="#ff9aa5" opacity="0.6" />
      <ellipse cx="29" cy="21" rx="1.6" ry="1" fill="#ff9aa5" opacity="0.6" />
      {/* scarf + buttons */}
      <path d="M16.5 24.5 Q24 28 31.5 24.5 L31 27 Q24 30.5 17 27 Z" fill="#e0483c" />
      <path d="M28 26.5 l2 7 l-3.4 0.4 Z" fill="#c23a30" />
      <circle cx="24" cy="32" r="1.2" fill="#232d45" />
      <circle cx="24" cy="37" r="1.2" fill="#232d45" />
    </g>
  );
}

function Gingerbread() {
  return (
    <g>
      <path
        d="M24 6 a7 7 0 0 1 5.4 11.5 Q36 18 40 20 a3.2 3.2 0 0 1 -2 6 L31 25 L33 37 Q35 41 32 43 Q29 44.5 27 41 L24 34 L21 41 Q19 44.5 16 43 Q13 41 15 37 L17 25 L10 26 a3.2 3.2 0 0 1 -2 -6 Q12 18 18.6 17.5 A7 7 0 0 1 24 6 Z"
        fill="#c27532"
        stroke="#7a420f"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* icing */}
      <path d="M11 23 q2 -1.5 4 0 M33 23 q2 -1.5 4 0 M16 39.5 q2 1.5 4 0 M28 39.5 q2 1.5 4 0" stroke="#fffaf0" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="21.5" cy="12" r="1.1" fill="#3b2412" />
      <circle cx="26.5" cy="12" r="1.1" fill="#3b2412" />
      <path d="M21.5 15 q2.5 2 5 0" stroke="#fffaf0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="22" r="1.5" fill="#e0483c" />
      <circle cx="24" cy="27" r="1.5" fill="#2f7a52" />
    </g>
  );
}

const ART: Record<Kind, () => React.JSX.Element> = {
  ball: Ball,
  star: Star,
  bell: Bell,
  candycane: CandyCane,
  stocking: Stocking,
  gift: Gift,
  snowman: Snowman,
  gingerbread: Gingerbread,
};

export default function OrnamentArt({ kind, size = 48, loop = true }: { kind: Kind; size?: number; loop?: boolean }) {
  const Art = ART[kind];
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" className="overflow-visible drop-shadow-[0_3px_4px_rgb(0_0_0/0.45)]">
      {loop && <Loop />}
      <Art />
    </svg>
  );
}
