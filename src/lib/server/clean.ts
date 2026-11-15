import { KINDS, type Kind } from "@/lib/ornaments";

// a few words that shouldn't end up on someone's tree (spaces/dots stripped before checking)
const BAD = ["시발", "씨발", "ㅅㅂ", "ㅆㅂ", "병신", "ㅂㅅ", "븅신", "좆", "존나", "ㅈㄴ", "개새", "새끼", "니애미", "느금", "꺼져", "닥쳐", "fuck", "shit", "bitch"];

export function isRude(text: string) {
  const flat = text.toLowerCase().replace(/[\s.\-_*~!?,]/g, "");
  return BAD.some((w) => flat.includes(w));
}

const hasLink = (text: string) => /https?:\/\/|www\.|\.(com|net|kr|io|ly)\b/i.test(text);

// names: Korean, English, numbers, spaces, a few symbols
export function cleanName(v: unknown, max: number) {
  if (typeof v !== "string") return null;
  const s = v.normalize("NFC").replace(/\s+/g, " ").trim();
  if (s.length < 1 || s.length > max) return null;
  if (!/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 ._♡♥~!-]+$/.test(s)) return null;
  return s;
}

export function cleanMessage(v: unknown) {
  if (typeof v !== "string") return null;
  const s = v
    .normalize("NFC")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (s.length < 1 || s.length > 120) return null;
  return s;
}

export function cleanKind(v: unknown): Kind | null {
  return KINDS.includes(v as Kind) ? (v as Kind) : null;
}

export function badText(...texts: string[]) {
  if (texts.some(isRude)) return "예쁜 말로 써주세요 🎄";
  if (texts.some(hasLink)) return "링크는 달 수 없어요.";
  return null;
}

export function ipOf(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}
