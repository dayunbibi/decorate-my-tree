// classic Christmas ornaments
export const KINDS = ["ball", "star", "bell", "candycane", "stocking", "gift", "snowman", "gingerbread"] as const;
export type Kind = (typeof KINDS)[number];

export const KIND_NAME: Record<Kind, string> = {
  ball: "빨간 구슬",
  star: "별",
  bell: "종",
  candycane: "지팡이 사탕",
  stocking: "양말",
  gift: "선물 상자",
  snowman: "눈사람",
  gingerbread: "진저브레드",
};

export type Ornament = { id: number; kind: Kind; author: string; slot: number; message?: string };
export type Tree = { name: string; owner: boolean; open: boolean; ornaments: Ornament[] };

export const MAX_ORNAMENTS = 120;
export const PER_PAGE = 20; // spots on one tree picture

// Messages open on Christmas, Korea time (most friends are there).
// NEXT_PUBLIC_OPEN_AT lets me test the "after Christmas" screen locally.
export const OPEN_AT = new Date(process.env.NEXT_PUBLIC_OPEN_AT || "2026-12-25T00:00:00+09:00");
