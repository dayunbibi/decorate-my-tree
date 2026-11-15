// small line icons from the handoff screens
type P = { size?: number; className?: string };
const base = (size: number) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true });

export const TreeIcon = ({ size = 20, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M12 3l3.5 6H13l4 6h-3l4 5H6l4-5H7l4-6H8.5z" />
  </svg>
);
export const LockIcon = ({ size = 12, className }: P) => (
  <svg {...base(size)} strokeWidth={2.4} className={className}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
export const OrnamentIcon = ({ size = 20, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <circle cx="12" cy="14" r="7" />
    <path d="M10 7h4V4h-4z" />
    <path d="M12 11v6M9 14h6" />
  </svg>
);
export const ShareIcon = ({ size = 20, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M12 15V3M7 8l5-5 5 5" />
    <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
  </svg>
);
export const KeyIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <circle cx="8" cy="15" r="4" />
    <path d="M11 12l9-9M17 6l3 3M15 8l2 2" />
  </svg>
);
export const DownloadIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M4 19h16" />
  </svg>
);
export const PrevIcon = ({ size = 18 }: P) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
export const NextIcon = ({ size = 18 }: P) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
