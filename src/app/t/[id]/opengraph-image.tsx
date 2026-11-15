import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dbEnabled, getTree } from "@/lib/server/db";

// Link preview for one tree: "○○님의 트리를 꾸며줘" over the tree picture.
// Threads/KakaoTalk show this when someone pastes a tree link.
export const alt = "내 트리를 꾸며줘 크리스마스 트리";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Google Fonts sends only the letters we ask for, so the Korean font stays small
async function font(family: string, weight: number, text: string) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`, {
    signal: AbortSignal.timeout(3000),
  }).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format/)?.[1];
  if (!url) throw new Error("font not found");
  return fetch(url, { signal: AbortSignal.timeout(3000) }).then((r) => r.arrayBuffer());
}

async function treeName(id: string) {
  if (!/^[A-Za-z0-9]{8}$/.test(id) || !dbEnabled()) return null;
  try {
    return (await getTree(id, null))?.name ?? null;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const name = await treeName((await params).id);
  const title = name ? `${name}님의 트리를` : "내 트리를";
  const sub = "오너먼트 하나 달아주세요";
  const chip = "향수병 게임즈 · 크리스마스 편";

  // the tree + snow background (same picture as the home link preview, without the words)
  const bg = `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "public/og-bg.jpg"))).toString("base64")}`;

  const fonts = [];
  try {
    fonts.push({ name: "Gowun Batang", data: await font("Gowun+Batang", 700, `${title}꾸며줘`), weight: 700 as const });
    fonts.push({ name: "IBM Plex Sans KR", data: await font("IBM+Plex+Sans+KR", 500, `${sub}${chip}`), weight: 500 as const });
  } catch {
    // without the fonts the picture still renders with the default font
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0d1322" }}>
        <img src={bg} width={1200} height={630} alt="" style={{ position: "absolute", left: 0, top: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", paddingLeft: 90, paddingTop: 150, width: 720 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 18px",
              borderRadius: 999,
              border: "2px solid rgba(255,210,122,0.35)",
              background: "rgba(9,12,20,0.6)",
              color: "#f4be4f",
              fontSize: 22,
              fontFamily: "IBM Plex Sans KR",
            }}
          >
            {chip}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontFamily: "Gowun Batang", fontWeight: 700, fontSize: name && name.length > 6 ? 72 : 88, lineHeight: 1.12, color: "#fff6e6", letterSpacing: -2 }}>
            <span>{title}</span>
            <span>꾸며줘</span>
          </div>
          <div style={{ display: "flex", marginTop: 26, fontFamily: "IBM Plex Sans KR", fontSize: 30, color: "#aeb5c6" }}>{sub}</div>
        </div>
      </div>
    ),
    // fonts: [] would wipe out the built-in fallback font, so only pass them when they loaded
    fonts.length ? { ...size, fonts } : size,
  );
}
