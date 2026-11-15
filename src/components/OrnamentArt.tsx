import type { Kind } from "@/lib/ornaments";

// Hand-drawn (well, hand-typed) winter snacks. 48x48, with a little gold loop on top
// so they look like they hang from the branch.

function Loop() {
  return (
    <g>
      <path d="M24 1 v5" stroke="#d9b45a" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24" cy="3" r="2.2" fill="none" stroke="#f5d27a" strokeWidth="1.4" />
    </g>
  );
}

function Bungeoppang() {
  return (
    <g>
      <defs>
        <radialGradient id="bp" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#f6c56b" />
          <stop offset="0.7" stopColor="#d98b32" />
          <stop offset="1" stopColor="#a85a1c" />
        </radialGradient>
      </defs>
      {/* tail */}
      <path d="M36 27 L46 19 Q44 28 46 37 Z" fill="#c9792b" stroke="#8a4a16" strokeWidth="1" strokeLinejoin="round" />
      {/* body */}
      <path d="M5 28 Q8 14 22 13 Q34 13 38 27 Q34 41 21 41 Q8 41 5 28 Z" fill="url(#bp)" stroke="#8a4a16" strokeWidth="1.2" />
      {/* fin + scales */}
      <path d="M18 14 Q22 9 28 14" fill="#d98b32" stroke="#8a4a16" strokeWidth="1" />
      <g fill="none" stroke="#a85a1c" strokeWidth="1" opacity="0.8">
        <path d="M20 22 q3 3 0 6 M25 21 q3 3 0 6 M30 22 q3 3 0 6 M22 29 q3 3 0 6 M27 29 q3 3 0 6" />
      </g>
      <path d="M12 23 q2 5 0 10" fill="none" stroke="#a85a1c" strokeWidth="1.1" />
      <circle cx="9.5" cy="25" r="1.7" fill="#3b2412" />
      <circle cx="9" cy="24.4" r="0.5" fill="#fff" />
      <path d="M12 18 Q16 15 20 16" stroke="#fff3d6" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
    </g>
  );
}

function Hotteok() {
  return (
    <g>
      <defs>
        <radialGradient id="ht" cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#e7a85a" />
          <stop offset="0.65" stopColor="#c27532" />
          <stop offset="1" stopColor="#874616" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="27" rx="19" ry="17" fill="url(#ht)" stroke="#6f3810" strokeWidth="1.2" />
      {/* crispy edge + syrup peeking out */}
      <path d="M10 33 Q24 44 38 33" fill="none" stroke="#6f3810" strokeWidth="1" opacity="0.6" />
      <path d="M30 37 q2 4 -1 6 q-2 -2 1 -6" fill="#5a2c0c" />
      <circle cx="17" cy="24" r="1.2" fill="#3b2412" opacity="0.6" />
      <circle cx="29" cy="22" r="1" fill="#3b2412" opacity="0.6" />
      <circle cx="24" cy="31" r="1.1" fill="#3b2412" opacity="0.6" />
      <path d="M13 19 Q20 13 29 15" stroke="#fff3d6" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.55" />
    </g>
  );
}

function Gyul() {
  return (
    <g>
      <defs>
        <radialGradient id="gy" cx="38%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffc15a" />
          <stop offset="0.6" stopColor="#f58a1f" />
          <stop offset="1" stopColor="#c45f0c" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="27" r="17" fill="url(#gy)" stroke="#a24e0a" strokeWidth="1.1" />
      <g fill="#c45f0c" opacity="0.35">
        <circle cx="16" cy="30" r="0.9" />
        <circle cx="22" cy="35" r="0.9" />
        <circle cx="31" cy="31" r="0.9" />
        <circle cx="29" cy="23" r="0.9" />
        <circle cx="19" cy="22" r="0.9" />
      </g>
      <path d="M24 11 q-1 -2 1 -3" stroke="#4b6b2a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M25 10 Q33 5 37 11 Q31 15 25 10 Z" fill="#5f9a3a" stroke="#3d6624" strokeWidth="0.9" />
      <ellipse cx="17" cy="20" rx="4" ry="2.5" fill="#fff3d6" opacity="0.5" transform="rotate(-30 17 20)" />
    </g>
  );
}

function Goguma() {
  return (
    <g>
      <defs>
        <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9c3f55" />
          <stop offset="1" stopColor="#5e2032" />
        </linearGradient>
      </defs>
      <path d="M4 30 Q8 15 26 15 Q42 15 45 27 Q42 39 25 39 Q8 40 4 30 Z" fill="url(#gg)" stroke="#3d1220" strokeWidth="1.2" transform="rotate(-12 24 27)" />
      {/* split open: steaming yellow inside */}
      <path d="M13 26 Q24 17 36 22 Q26 31 13 26 Z" fill="#ffcf4d" stroke="#d99b1a" strokeWidth="0.9" transform="rotate(-12 24 27)" />
      <path d="M18 24 Q24 21 31 22" stroke="#fff3c4" strokeWidth="1.2" fill="none" strokeLinecap="round" transform="rotate(-12 24 27)" />
      <g fill="#2a0a14" opacity="0.5" transform="rotate(-12 24 27)">
        <circle cx="10" cy="32" r="0.8" />
        <circle cx="38" cy="31" r="0.8" />
        <circle cx="30" cy="35" r="0.8" />
      </g>
    </g>
  );
}

function Hoppang() {
  return (
    <g>
      <defs>
        <radialGradient id="hp" cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f3ece0" />
          <stop offset="1" stopColor="#d6cbb8" />
        </radialGradient>
      </defs>
      <path d="M6 36 Q5 13 24 12 Q43 13 42 36 Q24 42 6 36 Z" fill="url(#hp)" stroke="#b7a891" strokeWidth="1.2" />
      {/* red bean showing through + a blush, because 호빵 is cute */}
      <ellipse cx="24" cy="27" rx="7" ry="5" fill="#8a3b3b" opacity="0.18" />
      <circle cx="17" cy="29" r="1.4" fill="#3b2412" />
      <circle cx="31" cy="29" r="1.4" fill="#3b2412" />
      <path d="M22 32 q2 2 4 0" stroke="#3b2412" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <ellipse cx="13.5" cy="32" rx="2.4" ry="1.4" fill="#ff9aa5" opacity="0.6" />
      <ellipse cx="34.5" cy="32" rx="2.4" ry="1.4" fill="#ff9aa5" opacity="0.6" />
      <path d="M13 19 Q18 14 25 15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Gyeranppang() {
  return (
    <g>
      <defs>
        <radialGradient id="gr" cx="45%" cy="35%" r="70%">
          <stop offset="0" stopColor="#f7c86e" />
          <stop offset="0.7" stopColor="#d9913c" />
          <stop offset="1" stopColor="#a35e1c" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="27" rx="14" ry="18" fill="url(#gr)" stroke="#7a420f" strokeWidth="1.2" />
      <ellipse cx="24" cy="23" rx="9" ry="8" fill="#fffaf0" stroke="#e8dcc4" strokeWidth="0.8" />
      <circle cx="24" cy="23" r="4.6" fill="#ffb21f" stroke="#e08a00" strokeWidth="0.8" />
      <circle cx="22.6" cy="21.6" r="1.3" fill="#fff3c4" opacity="0.8" />
      <circle cx="18" cy="35" r="0.8" fill="#7a420f" opacity="0.5" />
      <circle cx="29" cy="37" r="0.8" fill="#7a420f" opacity="0.5" />
    </g>
  );
}

const ART: Record<Kind, () => React.JSX.Element> = {
  bungeoppang: Bungeoppang,
  hotteok: Hotteok,
  gyul: Gyul,
  goguma: Goguma,
  hoppang: Hoppang,
  gyeranppang: Gyeranppang,
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
