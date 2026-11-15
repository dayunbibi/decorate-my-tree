// Ornaments are Korean winter street snacks instead of glass balls.
export const KINDS = ["bungeoppang", "hotteok", "gyul", "goguma", "hoppang", "gyeranppang"] as const;
export type Kind = (typeof KINDS)[number];

export const KIND_NAME: Record<Kind, string> = {
  bungeoppang: "붕어빵",
  hotteok: "호떡",
  gyul: "귤",
  goguma: "군고구마",
  hoppang: "호빵",
  gyeranppang: "계란빵",
};

export type Ornament = { id: number; kind: Kind; author: string; slot: number; message?: string };
export type Tree = { name: string; owner: boolean; open: boolean; ornaments: Ornament[] };

export const MAX_ORNAMENTS = 120;
export const PER_PAGE = 20; // spots on one tree picture

// Messages open on Christmas, Korea time (most friends are there).
// NEXT_PUBLIC_OPEN_AT lets me test the "after Christmas" screen locally.
export const OPEN_AT = new Date(process.env.NEXT_PUBLIC_OPEN_AT || "2026-12-25T00:00:00+09:00");
